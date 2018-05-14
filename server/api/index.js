const express = require('express');
const restaurant = require('./restaurant');
const menus = require('./menus');
const bocas = require('./bocas');
const cart = require('./cart');
const orders = require('./orders');
const users = require('./users');
const auth = require('./auth');
const { authenticate } = require('../config/passport');

const router = express.Router();

router.get('/status', (req, res) => res.send('OK'));
router.use('/docs', express.static('docs'));

router.use('/restaurant', restaurant);
router.use('/menus', menus);
router.use('/bocas', bocas);
router.use('/cart', cart);
router.use('/orders', orders);
router.use('/users', users);
router.use('/auth', auth);

module.exports = router;