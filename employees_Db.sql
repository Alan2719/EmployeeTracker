DROP DATABASE IF EXISTS employees_Db;
-- Create a database called programming_db --
CREATE DATABASE employees_Db;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';

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
VALUES ("Enginnering"),("Sales"),("Legal"),("Marketing");

INSERT INTO roles (department_id, title, salary)
VALUES (1,"Design Enginner", 30000), (1,"Software Enginner",30000), (2, "Purchase Lead", 25000),
(2,"Purchase Person",22000), (3,"Sales Lead",25000), (3,"Sales Person", 25000) ,(4,"Marketing Lead",22000), (4,"Marketing Person","20000");
	
/*INSERT INTO employee (first_name, last_name)
VALUES ("Alan","Velazquez"), ("Diego","Acosta"), ("Víctor","Salgado"),
("David","Morales"), ("Diana", "España"), ("Francisco","Sanchez"),
("Eréndira","Acuña"), ("Axel","Tovar"); */

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Alan","Velazquez", 1, null), ("Diego","Acosta", 2, 1), ("Víctor","Salgado", 3, null),
("David","Morales", 4, 3), ("Diana", "España", 5, null), ("Francisco","Sanchez", 6, 5),
("Eréndira","Acuña", 7, null), ("Axel","Tovar", 8, 7); 


SELECT employee_id, first_name, last_name, title, department, salary, manager_id, roles.role_id, employee.role_id
FROM employee
RIGHT JOIN roles ON employee.role_id = roles.role_id
RIGHT JOIN departments ON roles.department_id = departments.id;

WITH data AS (SELECT employee_id, first_name, last_name, title, department, salary, manager_id
FROM employee
RIGHT JOIN roles ON employee.role_id = roles.role_id
RIGHT JOIN departments ON roles.department_id = departments.id)
SELECT  employee_2.manager_id, CONCAT(Manager_2.first_name, " ", Manager_2.last_name) AS Manager, employee_2.title, employee_2.salary, employee_2.first_name, employee_2.last_name 
FROM data AS employee_2
LEFT OUTER JOIN data AS Manager_2
ON employee_2.manager_id =  Manager_2.employee_id;

SELECT employee_id, first_name, last_name, title, department, salary, manager_id
FROM employee
RIGHT JOIN roles ON employee.role_id = roles.role_id
RIGHT JOIN departments ON roles.department_id = departments.id
WHERE first_name = "Diana" or title = "Purchase Person";

SELECT employee_id 
FROM employee
WHERE first_name = "Diana" or last_name = "Acosta";

SELECT salary
FROM roles
WHERE title = "Design Enginner";

SELECT CONCAT(manager.first_name, " ",manager.last_name) AS Manager,
employee_1.last_name, 
employee_1.first_name 
FROM employee AS employee_1 
INNER JOIN employee AS manager
ON employee_1.manager_id = manager.employee_id;

select *
from departments;

select *
from roles;

select *
from employee;

