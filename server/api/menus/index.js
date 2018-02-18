const express = require('express');
const validate = require('express-validation');

const { menu } = require('./validations');

const { createMenu } = require('./actions');

const router = express.Router();

router.route('/create').post(validate(menu), createMenu);

module.exports = router;