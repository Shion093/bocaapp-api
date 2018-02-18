const express = require('express');
const menus = require('./menus');
const bocas = require('./bocas');

const router = express.Router();

router.get('/status', (req, res) => res.send('OK'));
router.use('/docs', express.static('docs'));

router.use('/menus', menus);
router.use('/bocas', bocas);

module.exports = router;