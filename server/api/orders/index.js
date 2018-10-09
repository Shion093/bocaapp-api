const express = require('express');
const validate = require('express-validation');
const multer = require('multer');
const { authenticate } = require('../../config/passport');

const { product, assign } = require('./validations');

const { createOrder, userOrders, reOrder, allOrders, changeOrderStatus } = require('./actions');

const router = express.Router();

router.route('/create').post(createOrder);
router.route('/reorder').post(reOrder);
router.route('/status').post(changeOrderStatus);
router.route('/all').get(authenticate(), allOrders);
router.route('/:userId').get(userOrders);

module.exports = router;
