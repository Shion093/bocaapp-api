const express = require('express');

const { createMenu } = require('./actions');

const router = express.Router();

router.route('/create').get(createMenu);

module.exports = router;