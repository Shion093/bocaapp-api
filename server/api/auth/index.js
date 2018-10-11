const express = require('express');
const validate = require('express-validation');
const multer = require('multer');

const { login } = require('./validations');

const { loginAdmin, loginUser, authNotifier } = require('./actions');

const router = express.Router();

router.route('/login/admin').post(validate(login), loginAdmin);
router.route('/login/user').post(validate(login), loginUser);
router.route('/notifier').post(authNotifier);

module.exports = router;
