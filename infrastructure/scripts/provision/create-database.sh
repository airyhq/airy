#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

echo "Creating required databases..."

apt update 2>/dev/null
apt-get install postgresql-client -y --force-yes 2>/dev/null
psql -h postgres postgres -U postgresadmin -tc "SELECT 1 FROM pg_database WHERE datname = 'airy_core'" | grep -q 1 || psql -h postgres postgres -U postgresadmin -c "CREATE DATABASE airy_core"
