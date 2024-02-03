const mysql = require('mysql2');
const dotenv = require('dotenv').config()

// create pool object
const pool = mysql.createPool({
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
})

module.exports = pool.promise()