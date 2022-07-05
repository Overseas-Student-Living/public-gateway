SHELL = /bin/bash

KUBE_NAMESPACE ?= stage
REGION ?= ap
KUBE_CONTEXT ?= stage.k8s.local

apply-secrets:
	for secret in $(shell ls $(KUBE_NAMESPACE)-$(REGION)) ; do \
		sops --decrypt $(KUBE_NAMESPACE)-$(REGION)/$$secret | \
		sed 's|_encrypted||g' | \
		kubectl --context=$(KUBE_CONTEXT) apply -f - ;\
	done
