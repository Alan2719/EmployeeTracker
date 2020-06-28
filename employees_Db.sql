DROP DATABASE IF EXISTS employees_Db;
-- Create a database called programming_db --
CREATE DATABASE employees_Db;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Arigatorei7-';

-- Use programming db for the following statements --
use employees_Db;

CREATE TABLE departments(
	id INTEGER auto_increment NOT NULL PRIMARY KEY,
    department varchar (30) NOT NULL
);

CREATE TABLE roles(
	role_id INTEGER auto_increment NOT NULL PRIMARY KEY,
    department_id INTEGER,
    title varchar (30) NOT NULL,
    salary INTEGER NOT NULL,
    CONSTRAINT FOREIGN KEY (department_id) REFERENCES departments (id)
);

CREATE TABLE employee(
	employee_id INTEGER auto_increment NOT NULL PRIMARY KEY,
    role_id INTEGER ,
    manager_id INTEGER,
    first_name varchar (30) NOT NULL,
    last_name varchar (30) NOT NULL,
    CONSTRAINT FOREIGN KEY (role_id) REFERENCES roles (role_id),
    CONSTRAINT FOREIGN KEY (manager_id) REFERENCES employee (employee_id) 
);

INSERT INTO departments (department)
VALUES ("Design");

INSERT INTO roles (title, salary)
VALUES ("Design Enginner", 30000);

INSERT INTO employee (first_name, last_name)
VALUES ("Alan","Velazquez");

SELECT *
FROM employee;

SELECT employee_id, first_name, last_name, title, department, salary, manager_id
FROM employee
RIGHT JOIN roles ON employee.role_id = roles.role_id
RIGHT JOIN departments ON roles.department_id = departments.id;


select *
from departments;

select *
from roles;

select *
from employee;
