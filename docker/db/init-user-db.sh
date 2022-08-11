#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE USER userdb;
	CREATE DATABASE rent_db;
	GRANT ALL PRIVILEGES ON DATABASE rent_db TO userdb;
EOSQL