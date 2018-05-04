const _ = require('lodash');
const { handler : errorHandler } = require('../../middlewares/errors');
const Restaurant = require('./model');
const User = require('../users/model');
const { createDomain } = require('../../helpers/route53');

async function createRestaurant (req, res, next) {
  try {
    const url = `${req.body.url}.bocaapp.com`;

    const user = await User.findOne({ email : req.body.email });
    if (_.isNull(user)) {
      return res.status(204).json({message : 'User not found'});
    }

    try {
      await createDomain(url);
    } catch (err) {
      return errorHandler(err, req, res);
    }

    req.body.admin = user._id;
    const restaurant = await (new Restaurant(req.body)).save();
    return res.status(200).json(restaurant);
  } catch (err) {
    console.log(err);
    return errorHandler(err, req, res);
  }
}

module.exports = {
  createRestaurant,
};