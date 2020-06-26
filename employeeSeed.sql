DROP DATABASE IF EXISTS employees_Db;

CREATE DATABASE employees_Db;

use employees_Db;

CREATE TABLE department(
	id INTEGER(10) auto_increment NOT NULL PRIMARY KEY,
    name varchar (30) NOT NULL
);

INSERT INTO products (name)
VALUES ("IT");