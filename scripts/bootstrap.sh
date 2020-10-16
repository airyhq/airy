#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

echo Hello, who am I talking to?
read varname
echo It\'s nice to meet you $varname


cd infrastructure
vagrant up
