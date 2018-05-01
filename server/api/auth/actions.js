const shortid = require('shortid');
const _ = require('lodash');
const { handler : errorHandler } = require('../../middlewares/errors');
const User = require('../users/model');

async function login (req, res, next) {
  try {
    const user = await User.findOne({email : req.body.email });
    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
      const token = user.generateToken(user);
      return res.status(200).json({token});
    }
    return res.status(204).json({error : 'Unatorized'});
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

module.exports = {
  login,
};