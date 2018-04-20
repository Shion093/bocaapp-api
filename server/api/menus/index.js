const express = require('express');
const validate = require('express-validation');
const multer = require('multer');

const { menu, singleMenu, menuUpdate } = require('./validations');

const { createMenu, getAllMenus, getMenuById, updateMenu, deleteMenu } = require('./actions');

const router = express.Router();

router.route('/create').post(multer().single('picture'), validate(menu), createMenu);
router.route('/update').post(multer().single('picture'), validate(menuUpdate), updateMenu);
router.route('/delete').post(deleteMenu);

router.route('/').get(getAllMenus);
router.route('/:id').get(validate(singleMenu), getMenuById);

module.exports = router;