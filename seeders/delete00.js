const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('../models/Site');
const Site = mongoose.model('Site');
require('dotenv').config({path: '../variables.env'});

mongoose.connect(process.env.DATABASE);
mongoose.connection.on('error', (err) => {
    console.log(err.message);
});

const delete00 = async () => {
    let found = await Site.remove({'location.coordinates': [0, 0]});
    console.log(found);
};

delete00();
