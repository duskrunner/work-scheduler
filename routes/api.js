const express = require('express');
const router = new express.Router();
const siteController = require('../controllers/sitesController');
const {catchError} = require('../handlers/errorHandlers');

router.get('/search', catchError(siteController.searchSites));
router.get('/sites/near', catchError(siteController.mapSites));
router.get('/sites/', catchError(siteController.mapAllSites));
router.get('/sites/todo', catchError(siteController.mapAllSitesWithTodo));
router.get('/sites/todo/priority', catchError(siteController.mapAllSitesWithPriorityTodo));

module.exports = router;
