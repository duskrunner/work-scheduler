let cheerio = require('cheerio');
let cheerioAdv = require('cheerio-advanced-selectors');
const axios = require('axios');
require('dotenv').config({path: '../variables.env'});
const iconv = require('iconv-lite');
const http = require("http");
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('../models/Site');
const Site = mongoose.model('Site');

const arrayShuffle = require('array-shuffle');

mongoose.connect(process.env.DATABASE);
mongoose.connection.on('error', (err) => {
    console.log(err.message);
});


cheerio = cheerioAdv.wrap(cheerio);

let urlList = [];
let ids = [];

let parseSivliaFind = async () => {
   let findHTML = await axios(`${process.env.SILVIAURL}/lfind.php`);
   let $ = cheerio.load(findHTML.data);
   $('center center table tbody').find('tr > td > a').each((index, element) => {
       urlList.push($(element).attr('href'));
   });
   console.log(urlList);
};

let getIds = () => {
    const regex = /\d+/;
    urlList.forEach((url) => {
       let result = regex.exec(url);
       console.log(result[0]);
       ids.push(result[0]);
    });
    ids = arrayShuffle(ids)
    console.log(ids);
};

let request = async (url, url2) => {
    http.get(url, (res) => {
        console.log(`Getting data from: ${url}`);
        res.pipe(iconv.decodeStream("win1251")).collect((err, body) => {
            if (err) console.log(err);
            let $ = cheerio.load(body);
            let siteNumber = $('.title').text();
            console.log(siteNumber);
            const nameRegEx = /78-\d+/;
            let siteName = nameRegEx.exec(siteNumber);
            if (siteName) {
                let addressRegEx = /Адрес:(.*)/;
                let siteAddress = addressRegEx.exec(siteNumber);
                let address = siteAddress[1].trim();
                console.log(address);
                http.get(url2, (res) => {
                    console.log(`Getting data from: ${url2}`);
                    res.pipe(iconv.decodeStream("win1251")).collect( async (err, body) => {
                        if (err) console.log(err);
                        let $ = cheerio.load(body);
                        let drive = $('textarea[name="t_drive"]').text();
                        let onPost = $('textarea[name="t_post"]').text();
                        let pathTo = $('textarea[name="t_path"]').text();
                        let roof = $('textarea[name="t_roof"]').text();
                        let description =`<strong>Проезд к объекту:</strong>${drive}<br>
                                          <strong>На проходной:</strong>${onPost}<br>
                                          <strong>Проход внутри здания:</strong>${pathTo}<br>
                                          <strong>Проход к антенам:</strong>${roof}<br>`;

                        let site = {
                            name: siteName[0],
                            slug: siteName[0],
                            description,
                            location: {
                                coordinates: [0, 0],
                                address
                            },
                            author: '59a8099e3f568503fc11366e'
                        };
                        Site.findOne({name: site.name}, (err, found) => {
                            if(found) {
                                Site.findByIdAndUpdate(found._id, site)
                            } else {
                                new Site(site).save();
                            }
                        });

                        console.log(site);
                    });
                }).on('error', console.error);
            }

        });
    }).on('error', console.error);
};

let parseSilviaEach = async () => {
    ids.forEach(async (id) => {
        request(`${process.env.SILVIAURL}/${process.env.FRAME1}${id}`, `${process.env.SILVIAURL}/${process.env.FRAME2}${id}`);
    });
};


let parser = async () => {
    await parseSivliaFind();
    await getIds();
    await parseSilviaEach();
};

parser();
