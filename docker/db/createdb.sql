-- Database: rent_db

-- DROP DATABASE IF EXISTS rent_db;

CREATE DATABASE rent_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'French_Belgium.1252'
    LC_CTYPE = 'French_Belgium.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

GRANT ALL ON DATABASE rent_db TO postgres;

GRANT TEMPORARY, CONNECT ON DATABASE rent_db TO PUBLIC;

GRANT ALL ON DATABASE rent_db TO userdbadmin;

GRANT ALL ON DATABASE rent_db TO admindb;

GRANT ALL ON DATABASE rent_db TO userdb WITH GRANT OPTION;