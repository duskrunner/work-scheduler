const mysql = require('mysql');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('../models/Site');
const Site = mongoose.model('Site');
require('dotenv').config({path: '../variables.env'});

mongoose.connect(process.env.DATABASE);
mongoose.connection.on('error', (err) => {
    console.log(err.message);
});

const con = mysql.createConnection({
    host: '10.16.7.167',
    user: 'selin',
    password: 'dukalis',
    database: 'ets',
});

con.connect((err) => {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
    con.query('SELECT * \n' +
        'FROM  `RBS_List` `', (err, rows) => {
        if (err) throw err;
        rows.forEach(async (item) => {
            let site = await Site.findOne({slug: item.NN_BTS4});
            site.location.coordinates = [item.Lon_WGS84, item.Lat_WGS84];
            console.log(site);
            await Site.findByIdAndUpdate(site._id, site);
        });
    });
});


