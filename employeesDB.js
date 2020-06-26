const mysql = require("mysql");

const connection = mysql.createConnection({
    host:"localhost",

    PORT: process.env.PORT || 3306,

    user:"root",

    password:"",
    database:"employees_Db"
});

connection.connect((err)=>{
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
});