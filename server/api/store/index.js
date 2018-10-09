const express = require('express');
const validate = require('express-validation');
const multer = require('multer');
const {authenticate} = require('../../config/passport');
const { hasAccess } = require('../../middlewares/acl');
const { menu, singleMenu, menuUpdate } = require('./validations');

const { createStore, storeByUser, storeByDomain, handleStore, allStores } = require('./actions');

const router = express.Router();

router.route('/create').post(authenticate(), createStore);
router.route('/:userId').get(storeByUser);
router.route('/client/:domain').get(storeByDomain);
router.route('/allStores').post(authenticate(), hasAccess(['superAdmin']), allStores);

router.route('/handleStore').post(authenticate(), hasAccess(['admin', 'superAdmin']), handleStore);

module.exports = router;