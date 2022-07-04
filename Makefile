.PHONY: test coverage
IMAGE_NAME = public-gateway
DOCKER_REGISTRY_HOST ?= docker-ap-southeast-1.dandythrust.com
KUBE_NAMESPACE ?= stage
KUBE_CONTEXT ?= stage.k8s.local
REGION ?= ap

# change this if you want to connect to a different rabbit you may have locally
PUBLIC_GATEWAY_RABBIT_CONTAINER_NAME ?= nameko-rpc-test-rabbit

ifdef CIRCLE_SHA1
GIT_SHA ?= $(CIRCLE_SHA1)
else
GIT_SHA ?= $(shell git rev-parse HEAD)
endif

IMAGE_TAG = $(GIT_SHA)

docker-login:
	docker login \
	--username=$(PRIVATE_DOCKER_USERNAME) \
	--password=$(PRIVATE_DOCKER_PASSWORD) \
	$(DOCKER_REGISTRY_HOST)

docker-tag:
	docker tag $(IMAGE_NAME):$(IMAGE_TAG) $(DOCKER_REGISTRY_HOST)/oslbuild/$(IMAGE_NAME):$(IMAGE_TAG)

docker-push:
	docker push $(DOCKER_REGISTRY_HOST)/oslbuild/$(IMAGE_NAME):$(IMAGE_TAG)

docker-save:
	mkdir docker-images
	docker save -o docker-images/public-gateway.tar $(IMAGE_NAME):$(IMAGE_TAG)

docker-load:
	docker load -i docker-images/public-gateway.tar

deploy-chart:
	helm upgrade $(IMAGE_NAME) deploy/chart/$(IMAGE_NAME) --install \
	--namespace=$(KUBE_NAMESPACE) --kube-context=$(KUBE_CONTEXT) \
	--set gitSha=$(GIT_SHA) \
	--set image.repository=$(DOCKER_REGISTRY_HOST)/oslbuild

deploy-secrets:
	devops_secrets load \
	--secrets=deploy/secrets/$(KUBE_NAMESPACE)-$(REGION).yaml \
	--private-key=ansible-$(KUBE_NAMESPACE)-rsa \
	| kubectl apply --context=$(KUBE_CONTEXT) -f -

deploy-configmaps:
	kubectl apply -f deploy/configmaps/$(KUBE_NAMESPACE)-$(REGION).yaml \
	--context=$(KUBE_CONTEXT)

run-nameko-test-service:
	$(MAKE) -C nameko-rpc/nameko-service build run

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
	-e ENTRYPOINT_LOGGING_RABBIT_SERVER=rabbitmq \
	--link nameko-rpc-test-rabbit:rabbitmq \
	node:8.6.0-alpine \
	yarn run coverage --verbose
	docker cp code:/code/coverage ./coverage

build:
	yarn install --non-interactive
	yarn run build
	mv node_modules node_modules_dev
	yarn install --prod --non-interactive
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .
	rm -rf node_modules
	mv node_modules_dev node_modules

run:
	docker run --init -d \
	--name $(IMAGE_NAME) \
	--link $(PUBLIC_GATEWAY_RABBIT_CONTAINER_NAME):rabbitmq \
	-e RABBIT_SERVER=rabbitmq \
	-e ENTRYPOINT_LOGGING_RABBIT_SERVER=rabbitmq \
	-p 8080:8080 \
	$(IMAGE_NAME):$(IMAGE_TAG)

sentry-release-create:
	sentry-cli releases new $(GIT_SHA)

sentry-release-deploy:
	sentry-cli releases deploys $(GIT_SHA) new --env $(KUBE_NAMESPACE)

sentry-release-finalize:
	sentry-cli releases finalize $(GIT_SHA)
