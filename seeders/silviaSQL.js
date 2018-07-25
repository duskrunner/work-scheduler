const mysql = require('mysql');
require('dotenv').config({path: '../variables.env'});
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('../models/Site');
const Site = mongoose.model('Site');

mongoose.connect(process.env.DATABASE);
mongoose.connection.on('error', (err) => {
    console.log(err.message);
});

const con = mysql.createConnection({
    host: process.env.SILVIA_HOST,
    user: process.env.SILVIA_USER,
    password: process.env.SILVIA_PASS,
    database: process.env.SILVIA_DB,
});
exports.syncWithSylvia = async () => {
    con.connect((err) => {
        if (err) {
            console.log('Error connecting to Db');
            return;
        }
        console.log('Connection established');
        con.query(`SELECT * FROM about_bts;`, (err, rows) => {
            if (err) throw err;
            // console.log(rows)
            rows.forEach(async (row) => {
                let siteNum = `78-${`${row.bts_number}`.slice(2)}`;
                // console.log(siteNum);
                let site = await Site.findOne({slug: siteNum});
                site.way_info = row.way_info;
                site.inner_info = row.inner_info;
                site.reception_info = row.reception_info;
                site.ams_info = row.ams_info;
                await con.query(`SELECT * FROM bts_contacts_rel WHERE bts_number=${row.bts_number};`, (err, rows) => {
                    if (err) throw err;
                    rows.forEach(async (row) => {
                        con.query(`SELECT * FROM bts_contacts WHERE id=${row.contact_id};`, async (err, rows) => {
                            if (err) throw err;
                            console.log(rows);
                            rows.forEach(async (row) => {
                                console.log(row);
                                site.contacts.push(row);
                            });
                            await Site.findByIdAndUpdate(site._id, site);
                        });
                    });
                });
            });
        });
    });
};


