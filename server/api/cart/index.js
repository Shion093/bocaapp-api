const express = require('express');
const validate = require('express-validation');
const multer = require('multer');

const { boca, assign } = require('./validations');

const { createCart, getCart, addToCart } = require('./actions');

const router = express.Router();

router.route('/create').post(createCart);

router.route('/add').post(addToCart);

router.route('/:id').get(getCart);

module.exports = router;
