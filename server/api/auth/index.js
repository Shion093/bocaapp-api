const express = require('express');
const validate = require('express-validation');
const multer = require('multer');

const { boca, assign } = require('./validations');

const { loginAdmin } = require('./actions');

const router = express.Router();

router.route('/login/admin').post(loginAdmin);

module.exports = router;
