const express = require('express');
const validate = require('express-validation');
const multer = require('multer');
const { authenticate } = require('../../config/passport');
const aclStore = require('../../helpers/aclStore');

const { boca, assign } = require('./validations');

const { createUser, test } = require('./actions');

const router = express.Router();

console.log(aclStore);

router.route('/create').post(createUser);
router.route('/test').post(authenticate(), test);

module.exports = router;
