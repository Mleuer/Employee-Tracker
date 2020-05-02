const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');



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
                    viewAll('employee');
                    break;
                case 'View all Deparments':
                    viewAll('department');
                    break;
                case 'View all Roles':
                    viewAll('role');
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

function viewAll(table) {
    connection.query(`SELECT * FROM ${table}`, (err, data) => {
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
                    type: "input",
                    name: 'manager',
                    message: `Who is the employee's manager?`,
                    choices: managers
                }
            ]).then(answers => {
                let roleID = data.forEach(element => element.title == answers.role);
                let managerID;
                result.forEach(element => {
                    if(element.first_name == answers.manager) {
                        managerID = element.id;
                    }
                })
                connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.employeeFirstName, answers.employeeLastName, roleID, managerID])
            })
        })

    })
}

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    initialPrompt();
});