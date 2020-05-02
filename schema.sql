DROP DATABASE IF EXISTS employeeTracker_db;

CREATE DATABASE employeeTracker_db;

USE employeeTracker_db;

CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY(id)
);

CREATE TABLE role(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY(department_id) REFERENCES department(id)
);

CREATE TABLE employee(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT, 
    PRIMARY KEY (id),
    FOREIGN KEY(role_id) REFERENCES role(id),
);

INSERT INTO department (name)
VALUES ("I.T.");

INSERT INTO department (name)
VALUES ("HR");

INSERT INTO role (title, salary, department_id)
VALUES ("Software Developer", "75000", 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", "100000", 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("David", "Lovett", 1, 2);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Matt", "Leuer", 2);
