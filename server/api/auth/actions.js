const shortid = require('shortid');
const _ = require('lodash');
const { handler : errorHandler } = require('../../middlewares/errors');
const User = require('../users/model');

async function loginAdmin (req, res, next) {
  try {
    const user = await User.findOne({ email : req.body.email });
    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch && (user.role === 'admin' || user.role === 'mod' || user.role === 'superAdmin')) {
      const { token, refreshToken } = user.generateToken(user);
      return res.status(200).json({ token, refreshToken, user : _.omit(user.toJSON(), ['password', '__v']) });
    }
    return res.status(403).json({ error : 'Unauthorized' });
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function loginUser (req, res, next) {
  try {
    const user = await User.findOne({ email : req.body.email });
    console.log(user);
    if (user) {
      const isMatch = await user.comparePassword(req.body.password);
      console.log(isMatch);
      if (isMatch && (user.role === 'user')) {
        const { token, refreshToken } = user.generateToken(user);
        return res.status(200).json({ token, refreshToken, user : _.omit(user.toJSON(), ['password', '__v', 'verificationCode']) });
      }
      return res.status(403).json({ error : 'Unauthorized' });
    } else {
      return res.status(401).json({ error: 'User not found' });
    }
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

module.exports = {
  loginAdmin,
  loginUser,
};