const express = require('express');
const validate = require('express-validation');

const { boca } = require('./validations');

const { createBoca } = require('./actions');

const router = express.Router();

router.route('/create').post(validate(boca), createBoca);

module.exports = router;