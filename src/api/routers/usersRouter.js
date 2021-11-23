const express = require('express');
const rescue = require('express-rescue');

const router = express.Router();
const controllers = require('../controllers');

router.post('/', rescue(controllers.usersController.createUser));

module.exports = router;