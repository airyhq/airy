#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

apk add --no-cache wget unzip jq bash-completion

curl -sfL https://get.k3s.io | sh -

wget -qnv https://get.helm.sh/helm-v3.3.4-linux-amd64.tar.gz
tar -zxvf helm-v3.3.4-linux-amd64.tar.gz
chmod +x linux-amd64/helm

sudo mv linux-amd64/helm /usr/local/bin/helm

while ! `test -f /etc/rancher/k3s/k3s.yaml`
do
    echo "Waiting for Kubernetes to start..."
    sleep 5
done
mkdir -p /root/.kube
ln -s /etc/rancher/k3s/k3s.yaml /root/.kube/config
chmod o+r /etc/rancher/k3s/k3s.yaml

cat <<EOF > /home/vagrant/.profile
. /etc/profile
. <(kubectl completion bash)
alias k=kubectl
complete -F __start_kubectl k
EOF

cat <<EOF > /root/.profile
. /etc/profile
. <(kubectl completion bash)
alias k=kubectl
complete -F __start_kubectl k
EOF
