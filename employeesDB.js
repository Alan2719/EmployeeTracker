const mysql = require("mysql");
const inquirer = require("inquirer");
let tableLenght;
let allRoles;

const connection = mysql.createConnection({
    host:"localhost",

    PORT: process.env.PORT || 3306,

    user:"root",

    password:"Arigatorei7-",
    database:"employees_Db"
});

connection.connect((err)=>{
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    getInfo();
    selectOption();
});

console.log(allRoles);

function selectOption() {
    inquirer.prompt([
        {
            type:"checkbox",
            message:'What would you like to do? ',
            name:'answer',
            choices: ["View All Employees", "View All Employees By Department", "View All Employees By Manager", "Add Employee", "Update Employee Role", "Exit"]
        }
    ]).then((response)=>{
        console.log(response.answer[0]);
        switch (response.answer[0]) {
            case "View All Employees":
                viewAllEmployees();
                break;
            case "View All Employees By Department":
                viewAllEmployeesByDept();
                break;
            case "View All Employees By Manager":
                viewAllEmployeesByMan();
                break;
            case "Add Employee":
                console.log(allRoles);
                addEmployees(allRoles, tableLenght);
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            case "Exit":
                connection.end();
            default:
                console.log("No valid choice!")
        }
    })
}

getInfo = () => {
    connection.query("SELECT employee_id, first_name, last_name, title, department, salary FROM employee RIGHT JOIN roles ON employee.role_id = roles.role_id RIGHT JOIN departments ON roles.department_id = departments.id;",(err,res)=>{
        if (err) throw err;
        tableLenght = res.length;
        let roles = res.map(roles => roles.title);
        allRoles = roles.filter((role,index)=> roles.indexOf(role) === index) 
    })
}

const viewAllEmployees = () => {
    connection.query("WITH data AS (SELECT employee_id, first_name, last_name, title, department, salary, manager_id FROM employee RIGHT JOIN roles ON employee.role_id = roles.role_id RIGHT JOIN departments ON roles.department_id = departments.id) SELECT CONCAT(Manager_2.first_name, ' ', Manager_2.last_name) AS Manager, employee_2.title, employee_2.salary, employee_2.first_name  ,employee_2.last_name  FROM data AS employee_2 LEFT OUTER JOIN data AS Manager_2 ON employee_2.manager_id = Manager_2.employee_id",(err,res)=>{
        if (err) throw err;
        console.table(res);
        tableLenght = res.length;
        let roles = res.map(roles => roles.title);
        allRoles = roles.filter((role,index)=> roles.indexOf(role) === index);
        selectOption();
    })
}

const viewAllEmployeesByDept = () => {
    connection.query("SELECT * FROM DEPARTMENTS ",(err,res)=> {
        if (err) throw err;
        console.log(res[0].department);
        inquirer.prompt([
            {
                name:"choice",
                type:"checkbox",
                choices: function() {
                    let choiceArray = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].department);
                    }
                    return choiceArray;
                },
                message: "Which department would you like to see employees for?"
            }
        ]).then((answer)=> {
            let departmentChosen = answer.choice[0];
            connection.query("SELECT employee_id, first_name, last_name, title FROM employee RIGHT JOIN roles ON employee.role_id = roles.role_id RIGHT JOIN departments ON roles.department_id = departments.id WHERE ?",
            [
                {
                    department: departmentChosen  
                }
            ],(err,res)=>{
                if (err) throw err;
                console.table(res);
                selectOption();
            })
        })
    })
}

const viewAllEmployeesByMan = () => {
    connection.query("SELECT * FROM EMPLOYEE",(err,res) => {
        if (err) throw err;
        console.log(res);
        let employeesArray = res.map(name => name.first_name + " " + name.last_name);
        console.log(employeesArray);
        inquirer.prompt([
            {
                name:"manager",
                type:"checkbox",
                choices:function() {
                    let employeesArray = res.map(name => name.first_name + " " + name.last_name);
                    return employeesArray
                },
                message:"Which employee do you want to see direct reports for?"
            }
        ]).then((answer)=>{
            console.log(answer.manager[0].split(" "));
            let arrayName = answer.manager[0].split(" ");
            let name = arrayName[0];
            connection.query("SELECT employee_id FROM EMPLOYEE WHERE ?",
            [
                {
                    first_name:name
                }
            ],(err,response)=>{
                if (err) throw err;
                let getID = response[0].employee_id;
                connection.query("SELECT employee_id, first_name, last_name, title FROM employee RIGHT JOIN roles ON employee.role_id = roles.role_id WHERE ?",
                [
                    {
                        manager_id: getID
                    }
                ],(err,res)=> {
                    console.table(res);
                    selectOption();
                })
            })
        })
    })
}

const addEmployees = (allRoles,tableLenght) => {
    connection.query("WITH data AS (SELECT employee_id, first_name, last_name, title, department, salary, manager_id FROM employee RIGHT JOIN roles ON employee.role_id = roles.role_id RIGHT JOIN departments ON roles.department_id = departments.id) SELECT employee_2.manager_id, CONCAT(Manager_2.first_name, ' ', Manager_2.last_name) AS Manager, employee_2.title, employee_2.salary, employee_2.first_name  ,employee_2.last_name  FROM data AS employee_2 INNER JOIN data AS Manager_2 ON employee_2.manager_id = Manager_2.employee_id",(err,res) => {
        if (err) throw err;
        //let rolesArray = res.map(roles => roles.title);
        //console.log(rolesArray);
        inquirer.prompt([
            {
                message:"What is the employee's first name?",
                type:"input",
                name:"firstName"
            },
            {
                message:"What is the employee's last name?",
                type:"input",
                name:"lastName"
            },
            {
                name:"role",
                type:"checkbox",
                choices: function() {
                    //let rolesArray = res.map(roles => roles.title);
                    let rolesArray = allRoles;
                    return rolesArray;
                },
                message:"What is the employee's role?"
            },
            {
                name:"manager",
                type:"checkbox",
                choices:function() {
                    let managersArray = res.map(manager => manager.Manager)
                    return managersArray
                },
                message:"Who is the employee's manager?"
            }
        ]).then((answer) => {
            let newFirstName = answer.firstName;
            let newLastName = answer.lastName;
            let newRole = answer.role[0];
            let getFirstName = answer.manager[0].split(" ")
            let firstName = getFirstName[0];
            let role = answer.role[0];
            connection.query("SELECT employee_id, department_id, first_name, last_name, title, department, salary FROM employee RIGHT JOIN roles ON employee.role_id = roles.role_id RIGHT JOIN departments ON roles.department_id = departments.id WHERE ? or ?",
            [
                {
                    first_name: firstName
                },
                {
                    title: role
                }
            ],(err,res) => {
                if (err) throw err;
                let roleID = tableLenght+ 1;
                let managerID = res[0].employee_id;
                let salary = res[1].salary;
                let departmentID = res[1].department_id;
                connection.query("INSERT INTO roles SET ?",
                {
                    department_id: departmentID,
                    title:newRole,
                    salary:salary
                },
                (err,res)=> {
                    connection.query("INSERT INTO employee SET ?",
                    {
                        first_name:newFirstName,
                        last_name:newLastName,
                        role_id: roleID,
                        manager_id:managerID
                    },
                    (err,res)=>{
                        console.log("Employee Added!");
                        selectOption();
                    })
                })
            })
            
        })
    })
}

const updateEmployeeRole = () => {
    connection.query("SELECT employee_id, first_name, last_name, title FROM employee RIGHT JOIN roles ON employee.role_id = roles.role_id",(err,res) => {
        if (err) throw err;
        console.log(res);
        let employeesArray = res.map(name => name.first_name + " " + name.last_name);
        //let roles = res.map(role => role.title);
        //console.log(employeesArray);
        inquirer.prompt([
            {
                name:"employee",
                type:"checkbox",
                choices:function() {
                    let employeesArray = res.map(name => name.first_name + " " + name.last_name);
                    return employeesArray
                },
                message:"Which employee's role do you want to update?"
            },
            {
                name:"role",
                type:"checkbox",
                choices:function(){
                    let roles = res.map(role => role.title);
                    return roles
                },
                message:"Which role do you want to assign the select employee?"
            }
        ]).then((answer)=>{
            console.log(answer);
            let arrayName = answer.employee[0].split(" ");
            let chosenEmployee = arrayName[0];
            let chosenRole = answer.role[0];
            connection.query("SELECT role_id FROM employee WHERE ?",
            [
                {
                    first_name: chosenEmployee
                }
            ],(err,res)=>{
                if (err) throw err;
                console.log(res);
                let roleID = res[0].role_id;
                connection.query("SELECT department_id, salary FROM roles WHERE ?",
                [
                    {
                        title: chosenRole
                    }
                ],(err,res)=> {
                    if (err) throw err;
                    console.log(res);
                    let departmentID = res[0].department_id;
                    let salary = res[0].salary;
                    connection.query("UPDATE roles SET ? WHERE ?",
                    [
                        {
                            department_id: departmentID,
                            salary: salary,
                            title: chosenRole
                        },
                        {
                            role_id: roleID
                        }
                    ],(err,res)=>{
                        if (err) throw err;
                        console.log(res);
                        selectOption();
                    })
                })
            })
        })
    })
}

