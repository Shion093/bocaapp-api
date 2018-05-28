const shortid = require('shortid');
const _ = require('lodash');
const { handler : errorHandler } = require('../../middlewares/errors');
const Cart = require('../cart/model');
const User = require('./model');

async function createUser (req, res, next) {
  try {
    console.log(req.body);
    const newUser = new User(req.body);
    const userSaved = await newUser.save();
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
    return res.status(200).json(req.user);
  } catch (err) {
    // console.log(err);
    return errorHandler(err, req, res, next);
  }
}

module.exports = {
  createUser,
  test,
};