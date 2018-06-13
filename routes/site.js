const express = require('express');
const router = new express.Router();
const {catchError} = require('../handlers/errorHandlers');
const sitesController = require('../controllers/sitesController');


router.get('/:slug', catchError(sitesController.getSiteBySlug));

module.exports = router;
