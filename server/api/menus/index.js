const express = require('express');
const validate = require('express-validation');
const multer = require('multer');

const { menu } = require('./validations');

const { createMenu, getAllMenus } = require('./actions');

const router = express.Router();

router.route('/create').post(
  multer().single('picture'),
  validate(menu),
  createMenu,
);

router.route('/').get(getAllMenus);

module.exports = router;