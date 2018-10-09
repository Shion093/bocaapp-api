const express = require('express');
const validate = require('express-validation');
const multer = require('multer');
const { authenticate } = require('../../config/passport');

const { product, assign, productUpdate } = require('./validations');

const { createProduct, getAllProducts, assignProductToMenu, removeProductFromMenu, updateProduct, deleteProduct } = require('./actions');

const router = express.Router();


// Admin
router.route('/admin/all').get(authenticate(), getAllProducts);

router.route('/create').post(authenticate(), multer().single('picture'), validate(product), createProduct);
router.route('/update').post(authenticate(), multer().single('picture'), validate(productUpdate), updateProduct);
router.route('/delete').post(authenticate(), deleteProduct);
router.route('/assign').post(authenticate(), validate(assign), assignProductToMenu);
router.route('/remove').post(authenticate(), validate(assign), removeProductFromMenu);

module.exports = router;
