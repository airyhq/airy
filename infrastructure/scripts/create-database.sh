#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

while ! nc -z postgres 5432; do sleep 10; echo "Waiting for Postgres to start..."; done

# TODO Check if postgress is already installed and if database exists
apt update
apt-get install postgresql-client -y --force-yes
PGPASSWORD=4fRteQH2MTKmZzdv psql -h postgres postgres -U postgresadmin -tc "SELECT 1 FROM pg_database WHERE datname = 'airy_core'" | grep -q 1 || PGPASSWORD=4fRteQH2MTKmZzdv psql -h postgres postgres -U postgresadmin -c "CREATE DATABASE airy_core"
