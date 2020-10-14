#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

vagrant init airy-core
vagrant up
