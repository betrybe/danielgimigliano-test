const express = require('express');
const rescue = require('express-rescue');

const router = express.Router();
const userRouter = require('./userRouter');
const loginRouter = require('./loginRouter');

router.use('/users', rescue(userRouter));
router.use('/login', rescue(loginRouter));

module.exports = router;