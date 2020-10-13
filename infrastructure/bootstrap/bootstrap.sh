#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

vagrant box add airy-core airy.box
vagrant init airy-core
vagrant up
