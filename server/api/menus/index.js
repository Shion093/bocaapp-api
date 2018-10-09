const express = require('express');
const validate = require('express-validation');
const multer = require('multer');
const { authenticate } = require('../../config/passport');

const { menu, singleMenu, menuUpdate } = require('./validations');

const { createMenu, getAllMenus, getMenuById, updateMenu, deleteMenu, getAllMenusClient } = require('./actions');

const router = express.Router();

router.route('/create').post(authenticate(), multer().single('picture'), validate(menu), createMenu);
router.route('/update').post(authenticate(), multer().single('picture'), validate(menuUpdate), updateMenu);
router.route('/delete').post(authenticate(), deleteMenu);

router.route('/admin/all').get(authenticate(), getAllMenus);
router.route('/client/:storeId').get(getAllMenusClient);
router.route('/:id').get(validate(singleMenu), getMenuById);

module.exports = router;