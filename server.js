const mysql = require('mysql');
const inquirer = require('inquirer');



const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "employeeTracker_db"
});

function initialPrompt() {
    inquirer.prompt(
        [
            {
                type: "rawlist",
                name: 'initial',
                message: 'What would you like to do',
                choices: ['View all Employees', 'View all Deparments', 'View all Roles', 'Add Employee', 'Add Department', 'Add Role', 'Update Employee Role']
            }
        ]).then(answers => {
            switch (answers.initial) {
                case 'View all Employees':
                    viewAllEmployees();
                    break;
                case 'View all Deparments':
                    viewAllDepartments();
                    break;
                case 'View all Roles':
                    viewAllRoles();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;
            }
        })
}

function viewAllEmployees() {
    connection.query(`SELECT first_name, last_name, title, salary, name
    FROM employee
    LEFT JOIN role
    ON employee.role_id = role.id
    LEFT JOIN department
    ON role.department_id = department.id;`, (err, data) => {
        console.table(data);
    });
    initialPrompt();
}

function viewAllDepartments() {
    connection.query(`SELECT * FROM department`, (err, data) => {
        console.table(data);
    });
    initialPrompt();
}

function viewAllRoles() {
    connection.query(`SELECT title, salary, name
    FROM role
    LEFT JOIN department
    ON role.department_id = department.id`, (err, data) => {
        console.table(data);
    });
    initialPrompt();
}

function addEmployee() {
    let roles = [];
    let managers = ['No manager'];

    connection.query(`SELECT * FROM role`, (err, data) => {
        if (err) throw err;

        data.forEach(element => roles.push(element.title));

        connection.query(`SELECT * FROM employee`, (err, result) => {
            result.forEach(element => managers.push(element.first_name));

            inquirer.prompt([
                {
                    type: "input",
                    name: 'employeeFirstName',
                    message: `What is the employee's first name?`,
                },
                {
                    type: "input",
                    name: 'employeeLastName',
                    message: `What is the employee's last name?`,
                },
                {
                    type: "rawlist",
                    name: 'role',
                    message: `What is the employee's role?`,
                    choices: roles
                },
                {
                    type: "rawlist",
                    name: 'manager',
                    message: `Who is the employee's manager?`,
                    choices: managers
                }
            ]).then(answers => {
                let role = data.find(element => element.title == answers.role);

                let manager = result.find(element => element.first_name == answers.manager);
                let managerID;
                if(manager) {
                    managerID = manager.id;
                }else {
                    managerID = null;
                }

                connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.employeeFirstName, answers.employeeLastName, role.id, managerID], (err, res) => {
                    if (err) throw err;
                    console.log("Employee added");
                    initialPrompt();
                });
            })
        })

    })
}

function addRole() {
    let departments = [];
    connection.query(`SELECT * FROM department`, (err, data) => {
        if (err) throw err;
        data.forEach(element => departments.push(element.name));


        inquirer.prompt([
            {
                type: "input",
                name: 'title',
                message: `What is the title of the new role?`
            },
            {
                type: "input",
                name: 'salary',
                message: `What is the salary of the new role?`
            },
            {
                type: "rawlist",
                name: 'department',
                message: `What department is this role in?`,
                choices: departments
            }
        ]).then(answers => {
            let department = data.find(element => element.name == answers.department);

            connection.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.title, answers.salary, department.id], (err, result) => {
                if(err) throw err;
                console.log("Role Added");
                initialPrompt();
            });
        })
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: 'name',
            message: `What is the name of the new department?`
        }
    ]).then(answers => {
        connection.query(`INSERT INTO department (name) VALUES (?)`, [answers.name], (err, result) => {
            if(err) throw err;
            console.log("Department Added");
            initialPrompt();
        });
    })
}

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    initialPrompt();
});