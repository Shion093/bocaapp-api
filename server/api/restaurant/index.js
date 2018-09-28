const express = require('express');
const validate = require('express-validation');
const multer = require('multer');
const {authenticate} = require('../../config/passport');
const { hasAccess } = require('../../middlewares/acl');
const { menu, singleMenu, menuUpdate } = require('./validations');

const { createRestaurant, restaurantByUser, restaurantByDomain, handleStore } = require('./actions');

const router = express.Router();

router.route('/create').post(authenticate(), createRestaurant);
router.route('/:userId').get(restaurantByUser);
router.route('/client/:domain').get(restaurantByDomain);

router.route('/handleStore').post(authenticate(), hasAccess(['admin']), handleStore);

module.exports = router;