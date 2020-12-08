#!/bin/bash

# Waiting for a port for an internal kubernetes service to open
function wait-for-service {
    local pod=${1}
    local service=${2}
    local port=${3}
    local delay=${4}
    local name=${5}

    kubectl exec ${pod} -- /bin/sh -c "while ! nc -z ${service} ${port} >/dev/null 2>&1; do sleep ${delay}; echo Waiting for ${name} to start...; done"
}

# Waiting for a pod with a specific name to be in Running phase
function wait-for-running-pod {
    local name=${1}

    while ! `kubectl get pod --field-selector="metadata.name=${name},status.phase=Running" 2>/dev/null| grep -q ${name}`
    do
        echo "Waiting for the Airy startup helper to start..."
        sleep 5
    done
}

# Waiting for the ingress service to appear
function wait-for-ingress-service {
    while ! `kubectl -n kube-system get service --field-selector="metadata.name=traefik" 2>/dev/null | grep -q "traefik"`
    do
        echo "Waiting for traefik to start..."
        sleep 5
    done
}

# Waiting for the default service account to be created
function wait-for-service-account {
    while ! `kubectl get sa default 2>/dev/null| grep -q default`
    do
        echo "Waiting for default ServiceAccount to be created..."
        sleep 5
    done
}
