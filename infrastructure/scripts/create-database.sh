#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

# TODO Check if postgress is already installed and if database exists
apt update
apt-get install postgresql-client -y --force-yes
PGPASSWORD=4fRteQH2MTKmZzdv psql -h postgres postgres -U postgresadmin -c 'CREATE DATABASE airy_core;' || true