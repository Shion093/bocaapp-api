const express = require('express');
const validate = require('express-validation');
const multer = require('multer');

const { menu, singleMenu } = require('./validations');

const { createMenu, getAllMenus, getMenuById } = require('./actions');

const router = express.Router();

router.route('/create').post(multer().single('picture'), validate(menu), createMenu);

router.route('/').get(getAllMenus);
router.route('/:id').get(validate(singleMenu), getMenuById);

module.exports = router;