#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

kubectl uncordon airy

chmod o+r /etc/rancher/k3s/k3s.yaml
