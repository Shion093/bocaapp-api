const express = require('express');
const validate = require('express-validation');
const multer = require('multer');
const { authenticate } = require('../../config/passport');

const { product, assign } = require('./validations');

const { createCart, getCart, addToCart, removeFromCart } = require('./actions');

const router = express.Router();

router.route('/create').post(createCart);

router.route('/add').post(authenticate(), addToCart);

router.route('/remove').post(removeFromCart);

router.route('/:userId/:storeId').get(getCart);

module.exports = router;
