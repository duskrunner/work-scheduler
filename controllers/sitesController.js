const mongoose = require('mongoose');
require('../models/Site');
const Site = mongoose.model('Site');
const mysql = require('mysql');

exports.sitesPage = async (req, res, next) => {
    const sites = await Site.find();
    res.render('sites', {title: 'Сайты', sites});
};

const confirmOwner = (site, user) => {
    if (!site.author.equals(user._id)) {
        throw Error('Не ты создавал, не тебе и редактировать.');
    }
};

exports.editSite = async (req, res, next) => {
    const site = await Site.findOne({_id: req.params.id});
    confirmOwner(site, req.user);
    res.render('editSite', {title: `Редактирование ${site.name}`, site});
};

exports.updateSite = async (req, res, next) => {
    const site = await Site.findOneAndUpdate({_id: req.params.id}, req.body, {
        new: true,
        runValidators: true,
    }).exec();
    req.flash('saved', `Изменения на <strong>${site.name}</strong> успешно сохранены`);
    res.redirect(`/sites/${site._id}/edit`);
};

exports.getSiteBySlug = async (req, res, next) => {
    const site = await Site.findOne({slug: req.params.slug}).populate('author todos');
    if (!site) return next();
    res.render('site', {site, title: site.name});
};

exports.searchSites = async (req, res) => {
    const sites = await Site.find({
        $text: {
            $search: `"${req.query.q}"`,
        },
    });
    res.json(sites);
};

exports.mapSites = async (req, res) => {
    const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
    const q = {
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates,
                },
                $maxDistance: 5000,
            },
        },
    };
    const sites = await Site.find(q).populate('todos');
    let results = [];
    sites.forEach((site) => {
        if (site.todos[0]) {
            results.push(site);
        }
    });
    res.json(results);
};

exports.mapAllSites = async (req, res) => {
    const sites = await Site.find({}).populate('todos');
    res.json(sites);
};

exports.mapAllSitesWithTodo = async (req, res) => {
    let results = [];
    const sites = await Site.find({}).populate('todos');
    sites.forEach((site) => {
        if (site.todos[0]) {
            results.push(site);
        }
    });
    res.json(results);
};

exports.mapAllSitesWithPriorityTodo = async (req, res) => {
    let results = [];
    const sites = await Site.find({}).populate('todos');
    sites.forEach((site) => {
        if (site.todos[0]) {
            site.todos.forEach((todo) => {
                if (todo.priority === 1) {
                    if (!results.includes(site)) {
                        results.push(site);
                    }
                }
            });
        }
    });
    res.json(results);
};
