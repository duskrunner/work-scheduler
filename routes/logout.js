const express = require('express');
const router = express.Router();
authController = require('../controllers/authController');

router.get('/', authController.logout);

module.exports = router;
