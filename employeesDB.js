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
        //selectOption();
    })
}

/*const addEmployees = () => {
    connection.query()
}*/
