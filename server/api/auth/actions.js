const shortid = require('shortid');
const _ = require('lodash');
const { handler : errorHandler } = require('../../middlewares/errors');
const User = require('../users/model');

async function loginAdmin (req, res, next) {
  try {
    const user = await User.findOne({email : req.body.email });
    console.log(user);
    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch && (user.role === 'admin' || user.role === 'mod' || user.role === 'superAdmin')) {
      const token = user.generateToken(user);
      return res.status(200).json({token, user : _.omit(user.toJSON(), ['password', '__v'])});
    }
    return res.status(403).json({error : 'Unatorized'});
  } catch (err) {
    console.log(err);
    return errorHandler(err, req, res);
  }
}

module.exports = {
  loginAdmin,
};