const express = require('express');
const store = require('./store');
const menus = require('./menus');
const products = require('./products');
const cart = require('./cart');
const orders = require('./orders');
const users = require('./users');
const auth = require('./auth');
const { authenticate } = require('../config/passport');

const router = express.Router();

router.get('/status', (req, res) => res.send('OK'));
router.use('/docs', express.static('docs'));

router.use('/store', store);
router.use('/menus', menus);
router.use('/products', products);
router.use('/cart', cart);
router.use('/orders', orders);
router.use('/users', users);
router.use('/auth', auth);

module.exports = router;