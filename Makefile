.PHONY: test coverage
SHELL = /bin/bash
IMAGE_NAME = public-gateway
DOCKER_REGISTRY_HOST ?= us.gcr.io
DOCKER_REGISTRY_PROJECT ?= scomreg
DOCKER_REGISTRY ?= $(DOCKER_REGISTRY_HOST)/$(DOCKER_REGISTRY_PROJECT)
KUBE_NAMESPACE ?= stage
KUBE_CONTEXT ?= stage.k8s.local
REGION ?= ap

INTEGRATION_LOGS_PATH ?= integration-tests.log
TEST_ENVIRONMENT_ID ?= $(shell uuidgen)
PAYMENTS_SERVICE_WEB_SERVER_PORT ?= 8000
NGROK_SUBDOMAIN ?= payments-dev
RELEASE_NAME ?= public-gateway
REPLICA_COUNT ?= 2

# change this if you want to connect to a different rabbit you may have locally
PUBLIC_GATEWAY_RABBIT_CONTAINER_NAME ?= nameko-rpc-test-rabbit
APOLLO_STUDIO_GRAPHID ?= public-gateway-zg031k

ifdef CIRCLE_SHA1
GIT_SHA ?= $(CIRCLE_SHA1)
else
GIT_SHA ?= $(shell git rev-parse HEAD)
endif
REF ?= $(shell git branch | grep \* | cut -d ' ' -f2)

IMAGE_TAG = $(GIT_SHA)

gcloud-login:
	gcloud auth activate-service-account --key-file=$(shell pwd)/gcr_cred.json
	docker login -u $(GCLOUD_USER) -p '$(GCLOUD_SERVICE_KEY)' https://$(DOCKER_REGISTRY_HOST)

docker-login:
	docker login \
	--username=$(PRIVATE_DOCKER_USERNAME) \
	--password=$(PRIVATE_DOCKER_PASSWORD) \
	$(DOCKER_REGISTRY_HOST)

docker-tag:
	docker tag $(IMAGE_NAME):$(IMAGE_TAG) $(DOCKER_REGISTRY_HOST)/$(DOCKER_REGISTRY_PROJECT)/$(IMAGE_NAME):$(IMAGE_TAG)

docker-push:
	docker push $(DOCKER_REGISTRY_HOST)/$(DOCKER_REGISTRY_PROJECT)/$(IMAGE_NAME):$(IMAGE_TAG)

docker-upload: docker-tag docker-push

docker-save:
	mkdir docker-images
	docker save -o docker-images/images.tar \
	$(IMAGE_NAME):$(IMAGE_TAG)

docker-load:
	docker load -i docker-images/images.tar

deploy-chart:
	helm upgrade $(RELEASE_NAME) deploy/k8s/chart/$(IMAGE_NAME) --install \
	--namespace=$(KUBE_NAMESPACE) --kube-context=$(KUBE_CONTEXT) \
	--set gitSha=$(GIT_SHA) \
	--set image.repository=$(DOCKER_REGISTRY_HOST)/$(DOCKER_REGISTRY_PROJECT) \
	--set region=$(REGION) \
	--set replicaCount=$(REPLICA_COUNT)

test-chart:
	helm upgrade $(RELEASE_NAME) deploy/k8s/chart/$(IMAGE_NAME) --install \
	--dry-run --debug \
	--namespace=$(KUBE_NAMESPACE) --kube-context=$(KUBE_CONTEXT) \
	--set gitSha=$(GIT_SHA) \
	--set image.repository=$(DOCKER_REGISTRY_HOST)/$(DOCKER_REGISTRY_PROJECT) \
	--set region=$(REGION)

deploy-secrets:
	devops_secrets load \
	--secrets=deploy/k8s/secrets/$(KUBE_NAMESPACE)-$(REGION).yaml \
	--private-key=ansible-$(KUBE_NAMESPACE)-rsa \
	| kubectl apply --context=$(KUBE_CONTEXT) -f -

deploy-configmaps:
	kubectl apply -f deploy/k8s/configmaps/$(KUBE_NAMESPACE)-$(REGION).yaml \
	--context=$(KUBE_CONTEXT)

run-nameko-test-service:
	$(MAKE) -C src/nameko-rpc/nameko-service build run

install-test-dependencies: run-nameko-test-service
	yarn install --non-interactive
	cp .env.dist .env
	docker create -v /code --name code alpine:3.4 /bin/true
	docker cp . code:/code

coverage:
	docker run --rm \
	--volumes-from code \
	-w /code \
	-e RABBIT_SERVER=rabbitmq \
	--link nameko-rpc-test-rabbit:rabbitmq \
	node:12.20.0-alpine \
	yarn run coverage --verbose
	docker cp code:/code/coverage ./coverage

build:
	yarn install --non-interactive
	yarn run build
	yarn install --prod --non-interactive
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .


local-build:
	yarn install --non-interactive
	yarn run build
	mv node_modules node_modules_dev
	mv node_modules_prod node_modules || true
	yarn install --prod --non-interactive
	make docker-build
	mv node_modules node_modules_prod
	mv node_modules_dev node_modules

docker-build:
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .

# TODO
build-test:
	docker pull $(DOCKER_REGISTRY_HOST)/$(DOCKER_REGISTRY_PROJECT)/platform-base:latest
	docker tag $(DOCKER_REGISTRY_HOST)/$(DOCKER_REGISTRY_PROJECT)/platform-base:latest $(DOCKER_REGISTRY_PROJECT)/platform-base:latest
	docker build -t $(IMAGE_NAME)-test:$(IMAGE_TAG) \
	--build-arg PIP_INDEX_URL=https://devpi:$(DEVPI_HTTP_PASSWORD)@devpi.student.com/root/prod/+simple/ \
	-f test/integration/Dockerfile test/integration

# integration tests

TEST_DEPENDENCIES := \
	properties-service:prod:harness \
	listings-service:prod:harness \
	commission-service:prod:harness \
	users-service:prod:harness \
	landlords-service:prod:harness \
	universities-service:prod:harness \
	partners-service:prod:harness \
	bookings-service:prod:harness \
	locations-service:prod:harness \
	payments-service:prod:harness \
	tracking-service:prod:harness \
	special-offers-service:prod:harness \
	lead-gen-partners-service:prod:harness \
	translations-service:prod:harness \

# TODO
save-schema:
	docker run --name platform-gateway-schema --env REGION=preview --env SCHEMA_SAVING=true us.gcr.io/scomreg/platform-gateway:$(GIT_SHA) \
		sh -c "yarn run start & \&& ./wait-for-it.sh 127.0.0.1:8080 --timeout=10 --strict -- echo \"is up\" && yarn run save-schema http://127.0.0.1:8080/graphql && exit;"
	docker wait platform-gateway-schema;
	mkdir -p schema
	docker cp platform-gateway-schema:/home/node/app/schema.json ./schema/schema.json
	docker rm platform-gateway-schema

# KUBE_NAMESPACE=stage make publish-schema
publish-schema:
	rover graph introspect http://localhost:8080/graphql | rover graph publish $(APOLLO_STUDIO_GRAPHID)@$(KUBE_NAMESPACE) --schema -

# Prerequisite:
# 	set `APOLLO_KEY` to environment variable.
check-schema:
	docker run --name platform-gateway-schema -p 8080:8080 --env REGION=preview -d --env SCHEMA_SAVING=true us.gcr.io/scomreg/platform-gateway:9dc8c8dc40a2727eefcad27d3668f1d60ceecfad sh -c "yarn run start"
	./wait-for-it.sh 127.0.0.1:8080 --timeout=10 && echo "start"
	curl -sSL https://rover.apollo.dev/nix/latest --insecure | sh

	rover graph introspect http://127.0.0.1:8080/graphql | rover graph check $(APOLLO_STUDIO_GRAPHID)@uat2 --schema -

run-integration-tests:
	@echo 'Starting integration suite.'
	TEST_ENVIRONMENT_ID=$(TEST_ENVIRONMENT_ID) \
	NGROK_AUTHTOKEN=$(NGROK_AUTHTOKEN) \
	NGROK_SUBDOMAIN=$(NGROK_SUBDOMAIN) \
	PAYMENTS_SERVICE_WEB_SERVER_PORT=$(PAYMENTS_SERVICE_WEB_SERVER_PORT) \
	STRIPE_ACCOUNT_GBP_PUBLIC_KEY=$(STRIPE_ACCOUNT_GBP_PUBLIC_KEY) \
	STRIPE_ACCOUNT_GBP_SECRET_KEY=$(STRIPE_ACCOUNT_GBP_SECRET_KEY) \
	STRIPE_ACCOUNT_GBP_ENDPOINT_SECRET=$(STRIPE_ACCOUNT_GBP_ENDPOINT_SECRET) \
	STRIPE_ACCOUNT_GBP_DESTINATION=$(STRIPE_ACCOUNT_GBP_DESTINATION) \
	PLATFORM_GATEWAY_GIT_SHA=$(GIT_SHA) $$(get_compose run \
		$(TEST_DEPENDENCIES) \
		--file=test/integration/harness.yaml \
		--file=test/integration/test.yaml \
		--github-auth=$(GITHUB_AUTH_TOKEN)) up -d --force-recreate;

	@echo 'Waiting for integration tests to finish.'
	docker wait platform-gateway-test;

	@echo 'Saving integration tests logs.'
	PLATFORM_GATEWAY_GIT_SHA=$(GIT_SHA) $$(get_compose run \
		$(TEST_DEPENDENCIES) \
		--file=test/integration/harness.yaml \
		--file=test/integration/test.yaml \
		--github-auth=$(GITHUB_AUTH_TOKEN)) \
		logs --tail="all" > $(INTEGRATION_LOGS_PATH);

	@echo 'Printing test results'
	docker logs --tail=5000 platform-gateway-test;

	@echo 'Checking for success or failure'
	exit $$(docker inspect platform-gateway-test --format='{{.State.ExitCode}}')

run-services:
	PAYMENTS_SERVICE_WEB_SERVER_PORT=$(PAYMENTS_SERVICE_WEB_SERVER_PORT) \
		PLATFORM_GATEWAY_GIT_SHA=$(GIT_SHA) $$(get_compose run \
		$(TEST_DEPENDENCIES) \
		--github-auth=$(GITHUB_AUTH_TOKEN)) \
		up --force-recreate

stop-services:
	PLATFORM_GATEWAY_GIT_SHA=$(GIT_SHA) $$(get_compose run \
		$(TEST_DEPENDENCIES) \
		--file=test/integration/harness.yaml \
		--github-auth=$(GITHUB_AUTH_TOKEN)) \
		down --volumes --remove-orphans

update-snapshot: build build-test docker-tag
	PLATFORM_GATEWAY_GIT_SHA=$(GIT_SHA) $$(get_compose run \
		$(TEST_DEPENDENCIES) \
		--file=test/integration/harness.yaml \
		--github-auth=$(GITHUB_AUTH_TOKEN)) \
		up --force-recreate -d
	until $(curl --output /dev/null --silent --head --fail http://localhost:8080/graphiql); do \
		printf '.' \
		sleep 5 \
	done;
	behave test/integration \
	--define AMQP_URI=amqp://guest:guest@localhost:5673/ \
	--define GRAPHQL_URI=http://localhost:8080/graphql \
	--define snapshot-update --no-capture -m

run:
	docker run --init -d \
	--name $(IMAGE_NAME) \
	--link $(PUBLIC_GATEWAY_RABBIT_CONTAINER_NAME):rabbitmq \
	-e RABBIT_SERVER=rabbitmq \
	-p 8080:8080 \
	$(IMAGE_NAME):$(IMAGE_NAME)

nodemon:
	yarn run nodemon

develop_:
	yarn run develop

develop:
	yarn run clean
	yarn run build
	$(MAKE) -j2 nodemon develop_

sentry-release-create:
	sentry-cli releases new $(GIT_SHA)

sentry-release-deploy:
	sentry-cli releases deploys $(GIT_SHA) new --env $(KUBE_NAMESPACE)

sentry-release-finalize:
	sentry-cli releases finalize $(GIT_SHA)

run-brigade:
	echo '{"name": "$(ENV_NAME)"}' > payload.json
	brig run -c $(GIT_SHA) -r $(REF) -f brigade.js -p payload.json Overseas-Student-Living/public-gateway --kube-context stage.k8s.local --namespace brigade

-include Makefile.local
