const shortid = require('shortid');
const _ = require('lodash');
const errorHandler = require('../../middlewares/errors').handler;
const Cart = require('../cart/model');
const User = require('./model');
const acl = require('../../config/acl');
const authenticate = require('../../config/passport').authenticate;

async function createUser (req, res, next) {
  try {
    const newUser = new User(req.body);
    const userSaved = await newUser.save();
    console.log(userSaved);
    if (userSaved) {
      await acl.addUserRoles(userSaved._id.toString(), userSaved.role);
    } else {
      return errorHandler('duplicated', req, res, next)
    }

    return res.status(200).json(userSaved);
  } catch (err) {
    // console.log(err);
    return errorHandler(err, req, res, next);
  }
}

async function test (req, res, next) {
  try {
    console.log(req.headers);
    console.log(req.user);
    authenticate()
  } catch (err) {
    // console.log(err);
    return errorHandler(err, req, res, next);
  }
}

module.exports = {
  createUser,
  test,
};