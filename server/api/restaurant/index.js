const express = require('express');
const validate = require('express-validation');
const multer = require('multer');
const {authenticate} = require('../../config/passport');

const { menu, singleMenu, menuUpdate } = require('./validations');

const { createRestaurant, restaurantByUser, restaurantByDomain } = require('./actions');

const router = express.Router();

router.route('/create').post(authenticate(), createRestaurant);
router.route('/:userId').get(restaurantByUser);
router.route('/client/:domain').get(restaurantByDomain);

module.exports = router;