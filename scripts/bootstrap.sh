#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

cd infrastructure
vagrant init airy-core
vagrant up
