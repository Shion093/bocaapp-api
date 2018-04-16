const express = require('express');
const validate = require('express-validation');
const multer = require('multer');

const { boca, assign } = require('./validations');

const { createOrder } = require('./actions');

const router = express.Router();

router.route('/create').post(createOrder);

module.exports = router;
