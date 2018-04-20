const express = require('express');
const validate = require('express-validation');
const multer = require('multer');

const { boca, assign, bocaUpdate } = require('./validations');

const { createBoca, getAllBocas, assignBocaToMenu, removeBocaFromMenu, updateBoca } = require('./actions');

const router = express.Router();

router.route('/create').post(multer().single('picture'), validate(boca), createBoca);
router.route('/update').post(multer().single('picture'), validate(bocaUpdate), updateBoca);

router.route('/assign').post(validate(assign), assignBocaToMenu);

router.route('/remove').post(validate(assign), removeBocaFromMenu);

router.route('/').get(getAllBocas);

module.exports = router;
