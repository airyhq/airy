#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

echo "Scaling down Airy Core components"
kubectl drain airy --ignore-daemonsets --delete-emptydir-data 2>/dev/null
