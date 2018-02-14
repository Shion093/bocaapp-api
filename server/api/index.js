const express = require('express');
const menus = require('./menus');

const router = express.Router();

router.get('/status', (req, res) => res.send('OK'));
router.use('/docs', express.static('docs'));

router.use('/menus', menus);

module.exports = router;