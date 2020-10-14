#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

apt update
apt-get install postgresql-client
PGPASSWORD=4fRteQH2MTKmZzdv psql -h postgres postgres -U postgresadmin -c 'CREATE DATABASE airy_core;'