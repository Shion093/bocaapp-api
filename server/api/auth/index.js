const express = require('express');
const validate = require('express-validation');
const multer = require('multer');

const { boca, assign } = require('./validations');

const { login } = require('./actions');

const router = express.Router();

router.route('/login').post(login);

module.exports = router;
