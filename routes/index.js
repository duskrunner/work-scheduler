const express = require('express');
const router = new express.Router();
const homeController = require('../controllers/homeController');
const {catchError} = require('../handlers/errorHandlers');

router.get('/', homeController.homePage);

module.exports = router;
