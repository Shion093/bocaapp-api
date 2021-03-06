const shortid = require('shortid');
const _ = require('lodash');
const { handler : errorHandler } = require('../../middlewares/errors');
const Cart = require('../cart/model');
const User = require('./model');
const { sendSMS } = require('../../helpers/sns');
// const { sendSMS } = require('../../helpers/sms');


async function createUser (req, res, next) {
  try {
    const verificationCode = Math.floor(1000 + Math.random() * 9000);

    const params = {
      message : `Hello breee, su codigo de verificacion es: ${verificationCode}`,
      phone   : req.body.phoneNumber,
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
    return errorHandler(err, req, res, next);
  }
}

async function test (req, res, next) {
  try {
    return res.status(200).json(req.user);
  } catch (err) {
    return errorHandler(err, req, res, next);
  }
}

async function validateEmail (req, res, next) {
  try {
    const user = await User.findOne({ email : req.params.email });
    return res.status(200).json({ exist : user !== null });
  } catch (err) {
    return errorHandler(err, req, res, next);
  }
}

async function verifyPhone (req, res, next) {
  try {
    const user = await User.findOne({ email : req.user.email });
    if (user.verificationCode === req.body.code) {
      user.isActive = true;
      await user.save();
      return res.status(200).json({ confirmed : true });
    }
    return res.status(200).json({ confirmed : false });
  } catch (err) {
    return errorHandler(err, req, res, next);
  }
}

async function changePassword (req, res, next) {
  try {
    const user = await User.findOne({ email : req.user.email });
    const isMatch = await user.comparePassword(req.body.password);
    if (user && !isMatch) {
      user.password = req.body.password;
      await user.save();
      return res.status(200).json({ changed : true });
    }
    return res.status(200).json({ changed : false });
  } catch (err) {
    return errorHandler(err, req, res, next);
  }
}

async function verifyPhonePass (req, res, next) {
  try {
    const user = await User.findOne({
      email            : req.body.email,
      verificationCode : req.body.code,
    });
    if (user) {
      user.isActive = true;
      await user.save();
      const { token } = await user.generateToken(user);
      return res.status(200).json({ password : true, token });
    }
    return res.status(200).json({ password : false });
  } catch (err) {
    return errorHandler(err, req, res, next);
  }
}

async function forgotPassword (req, res, next) {
  try {
    const user = await User.findOne({ email : req.body.email });

    if (user) {
      const verificationCode = Math.floor(1000 + Math.random() * 9000);

      const params = {
        message : `Hello breee, su codigo de verificacion es: ${verificationCode}`,
        phone   : user.phoneNumber,
      };

      // Create promise and SNS service object
      await sendSMS(params);
      // user.isActive = false;
      user.verificationCode = verificationCode.toString();
      await user.save();
      return res.status(200).json({ sent : true });
    }
    return res.status(200).json({ sent : false });
  } catch (err) {
    return errorHandler(err, req, res, next);
  }
}

module.exports = {
  createUser,
  test,
  validateEmail,
  verifyPhone,
  forgotPassword,
  verifyPhonePass,
  changePassword,
};