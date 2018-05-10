const express = require('express');
const validate = require('express-validation');
const multer = require('multer');

const { menu, singleMenu, menuUpdate } = require('./validations');

const { createRestaurant, restaurantByUser } = require('./actions');

const router = express.Router();

router.route('/create').post(createRestaurant);
router.route('/:userId').get(restaurantByUser);

module.exports = router;