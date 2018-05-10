const express = require('express');
const validate = require('express-validation');
const multer = require('multer');
const { authenticate } = require('../../config/passport');

const { boca, assign, bocaUpdate } = require('./validations');

const { createBoca, getAllBocas, assignBocaToMenu, removeBocaFromMenu, updateBoca, deleteBoca } = require('./actions');

const router = express.Router();


// Admin
router.route('/admin/all').get(authenticate(), getAllBocas);

router.route('/create').post(authenticate(), multer().single('picture'), validate(boca), createBoca);
router.route('/update').post(authenticate(), multer().single('picture'), validate(bocaUpdate), updateBoca);
router.route('/delete').post(authenticate(), deleteBoca);
router.route('/assign').post(authenticate(), validate(assign), assignBocaToMenu);
router.route('/remove').post(authenticate(), validate(assign), removeBocaFromMenu);

module.exports = router;
