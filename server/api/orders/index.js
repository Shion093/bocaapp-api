const express = require('express');
const validate = require('express-validation');
const multer = require('multer');

const { boca, assign } = require('./validations');

const { createOrder, userOrders, reOrder } = require('./actions');

const router = express.Router();

router.route('/create').post(createOrder);
router.route('/reorder').post(reOrder);
router.route('/:userId').get(userOrders);

module.exports = router;
