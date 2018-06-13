const request = require('request-promise-native');
require('dotenv').config({path: '../variables.env'});
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('../models/Site');
const Site = mongoose.model('Site');

mongoose.connect(process.env.DATABASE);
mongoose.connection.on('error', (err) => {
    console.log(err.message);
});

let getCoords = async () => {
    let sites = await Site.find({});

    sites.forEach(async (site) => {
        let proxiedRequest = request.defaults({'proxy': process.env.PROXY});
        let body = await proxiedRequest.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(site.location.address)}&key=${process.env.GOOGLE_API_KEY}`);
        let data = JSON.parse(body);
        console.log(data);
        site.location.coordinates = [data.results[0].geometry.location.lng, data.results[0].geometry.location.lat];
        console.log(data.results[0].geometry.location.lat);
        await Site.findByIdAndUpdate(site._id, site);
    });
};

getCoords();
