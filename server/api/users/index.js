const express = require('express');
const validate = require('express-validation');
const multer = require('multer');
const { authenticate } = require('../../config/passport');
const { hasAccess } = require('../../middlewares/acl');

const { boca, assign } = require('./validations');

const { createUser, test } = require('./actions');

const router = express.Router();

router.route('/create').post(createUser);
router.route('/test').post(authenticate(), hasAccess(['admin']), test);

module.exports = router;