const express = require('express');
const router = new express.Router();
const sitesController = require('../controllers/sitesController');
const oftlmapController = require('../controllers/oftlmapController');
const authController = require('../controllers/authController');
const {catchError} = require('../handlers/errorHandlers');


router.get('/', catchError(sitesController.sitesPage));
router.get('/create-site', authController.isLoggedIn, oftlmapController.createSite);
router.post('/create-site', catchError(oftlmapController.saveSite));
router.post('/create-site/:id', catchError(sitesController.updateSite));
router.get('/:id/edit', authController.isLoggedIn, catchError(sitesController.editSite));

module.exports = router;
