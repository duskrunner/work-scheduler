const express = require('express');
const router = new express.Router();
const oftlmapController = require('../controllers/oftlmapController');
const authController = require('../controllers/authController');
const {catchError} = require('../handlers/errorHandlers');

router.get('/all', oftlmapController.oftlmapPage);
router.get('/create-site', authController.isLoggedIn, oftlmapController.createSite);
router.post('/create-site', catchError(oftlmapController.saveSite));
router.get('/map', oftlmapController.mapPage);
router.get('/todo', oftlmapController.mapTodoPage);
router.get('/todo/priority', oftlmapController.mapTodoPage);

module.exports = router;
