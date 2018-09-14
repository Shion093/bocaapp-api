const shortid = require('shortid');
const _ = require('lodash');
const { handler : errorHandler } = require('../../middlewares/errors');
const Cart = require('../cart/model');
const User = require('./model');
// const { sendSMS } = require('../../helpers/sns');
const { sendSMS } = require('../../helpers/sms');


async function createUser (req, res, next) {
  try {
    console.log(req.body);
    const verificationCode = Math.floor(1000 + Math.random() * 9000);

    const params = {
      message: `Hello breee, su codigo de verificacion es: ${verificationCode}`,
      phone: req.body.phoneNumber,
    };
    
    // Create promise and SNS service object

    await sendSMS(params);
    req.body.isActive = false;
    req.body.verificationCode = verificationCode.toString();
    req.body.username = req.body.email;
    const newUser = new User(req.body);
    const userSaved = await newUser.save();
    return res.status(200).json(_.omit(userSaved.toJSON(), ['password', 'verificationCode']));
  } catch (err) {
    console.log(err);
    return errorHandler(err, req, res, next);
  }
}

async function test (req, res, next) {
  try {
    console.log(req.headers);
    console.log(req.user);
    return res.status(200).json(req.user);
  } catch (err) {
    // console.log(err);
    return errorHandler(err, req, res, next);
  }
}

async function validateEmail (req, res, next) {
  try {
    const user = await User.findOne({ email : req.params.email });
    return res.status(200).json({exist: user !== null });
  } catch (err) {
    return errorHandler(err, req, res, next);
  }
}

async function verifyPhone (req, res, next) {
  try {
    console.log('furhfuhurufhr', req.user);
    console.log('furhfuhurufhr', req);
    const user = await User.findOne({ email : req.user.email });
    console.log('ueueueu', user);
    if ( user.verificationCode === req.body.code) {
      user.isActive = true;
      await user.save();
      return res.status(200).json({ confirmed : true });
    }
    return res.status(200).json({ confirmed : false });
  } catch(err) {
    return errorHandler(err, req, res, next);
  }
}

module.exports = {
  createUser,
  test,
  validateEmail,
  verifyPhone,
};