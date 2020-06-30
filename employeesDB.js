const mysql = require("mysql");
const inquirer = require("inquirer");

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
    selectOption();
});

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
                addEmployees();
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

const viewAllEmployees = () => {
    connection.query("SELECT employee_id, first_name, last_name, title, department, salary FROM employee RIGHT JOIN roles ON employee.role_id = roles.role_id RIGHT JOIN departments ON roles.department_id = departments.id;",(err,res)=>{
        if (err) throw err;
        console.table(res);
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
            })
        })
    })
    //selectOption();
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
                })
            })
        })
    })
    //selectOption();
}

const addEmployees = () => {
    connection.query("SELECT * FROM EMPLOYEE",(err,res) => {
        if (err) throw err;
        console.log(res);
        let rolesArray = res.map(roles => roles.role_id);
        console.log(rolesArray);
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
                    let rolesArray = res.map(roles => roles.role_id);
                    return rolesArray
                },
                message:"What is the employee's role?"
            },
            {
                name:"manager",
                type:"checkbox",
                choices:function() {

                }
            }
            
        ]).then((answer) => {
            console.log(answer);
        })
    })
    
    //connection.query("")
}

const updateEmployeeRole = () => {
    connection.query("SELECT employee_id, first_name, last_name, title FROM employee RIGHT JOIN roles ON employee.role_id = roles.role_id",(err,res) => {
        if (err) throw err;
        console.log(res);
        let employeesArray = res.map(name => name.first_name + " " + name.last_name);
        let roles = res.map(role => role.title);
        console.log(employeesArray);
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
            connection.query("UPDATE employee SET ? WHERE ?",
            [
                {
                    title:chosenRole
                },
                {
                    first_name:chosenEmployee
                }
            ],
            (err,res)=> {
                if (err) throw err;
                console.log(res.affectedRows + " employees updated!")
            })
        })
    })
}
