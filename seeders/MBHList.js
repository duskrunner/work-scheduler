const mysql = require('mysql');
require('dotenv').config({path: '../variables.env'});
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('../models/Site');
const Site = mongoose.model('Site');
const fs = require('fs');


const con = mysql.createConnection({
    host: process.env.GENESIS_IP,
    user: process.env.GENESIS_USER,
    password: process.env.GENESIS_PASS,
    database: process.env.GENESIS_DB,
});
con.connect((err) => {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
});
con.query(`SELECT adr FROM mbh_reg_list;`, (err, rows) => {
    if (err) throw err;
    rows.forEach((row) => {
        fs.appendFile('log.txt', `${row.adr}\n`, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log(row.adr);
            }
        });
    });
});


