const express = require('express');
const rescue = require('express-rescue');

const router = express.Router();
const userRouter = require('./userRouter');

router.use('/users', rescue(userRouter));

module.exports = router;