const path = require("path");
const fs = require("fs");
const mysql = require('mysql2');
require('dotenv').config(); // read environment variables from .env

const createTablesQuery = fs.readFileSync(path.join(__dirname, "sql", "createTables.sql")).toString();
const createTriggersQuery = fs.readFileSync(path.join(__dirname, "sql", "createTriggers.sql")).toString();
const initQuery = createTablesQuery + createTriggersQuery;

// default port is 3306
const db = mysql.createConnection({
    host: "localhost",
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT,
    multipleStatements: true,
});

db.connect(function (err) {
    if (err) throw err;
    db.query(initQuery, (err, result) => {
        if (err) throw err;
        db.destroy();
    });
});
