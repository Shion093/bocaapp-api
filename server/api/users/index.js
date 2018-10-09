const express = require('express');
const validate = require('express-validation');
const multer = require('multer');
const { authenticate } = require('../../config/passport');
const { hasAccess } = require('../../middlewares/acl');

const { product, assign } = require('./validations');

const { createUser, test, validateEmail, verifyPhone, forgotPassword, verifyPhonePass, changePassword } = require('./actions');

const router = express.Router();

router.route('/create').post(createUser);
router.route('/forgot').post(forgotPassword);
router.route('/verify').post(authenticate(), verifyPhone);
router.route('/changePass').post(authenticate(), changePassword);
router.route('/verifyPass').post(verifyPhonePass);
router.route('/test').post(authenticate(), hasAccess(['admin']), test);

router.route('/validateEmail/:email').get(validateEmail);
module.exports = router;
