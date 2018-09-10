const shortid = require('shortid');
const _ = require('lodash');
const { handler : errorHandler } = require('../../middlewares/errors');
const Cart = require('../cart/model');
const User = require('./model');
const aws = require('../../helpers/aws');


async function createUser (req, res, next) {
  try {
    console.log(req.body);
    const verificationCode = Math.floor(1000 + Math.random() * 9000);

    const params = {
      Message: `Hello breee, su codigo de verificacion es: ${verificationCode}`,
      PhoneNumber: req.body.phoneNumber,
    };
    
    // Create promise and SNS service object
    await new aws.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
    req.body.isActive = false;
    req.body.verificationCode = verificationCode.toString();
    req.body.username = req.body.email;
    const newUser = new User(req.body);
    const userSaved = await newUser.save();
    return res.status(200).json(_.omit(userSaved, ['password', 'verificationCode']));
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
    return res.status(200).json({exist: user !== null });;
  } catch (err) {
    return errorHandler(err, req, res, next);
  }
}

module.exports = {
  createUser,
  test,
  validateEmail,
};