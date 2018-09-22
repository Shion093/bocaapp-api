const _ = require('lodash');
const { handler : errorHandler } = require('../../middlewares/errors');
const Restaurant = require('./model');
const User = require('../users/model');
const Menu = require('../menus/model');
const { createDomain } = require('../../helpers/route53');

async function createRestaurant (req, res, next) {
  try {
    const url = `${req.body.domain}.bocaapp.com`;

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
    await User.findOneAndUpdate({ _id : user._id }, { role : 'admin' , restaurant : restaurant._id});
    return res.status(200).json(restaurant);
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function restaurantByUser (req, res, next) {
  try {
    const restaurant = await Restaurant.findOne({ admin : req.params.userId });
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function restaurantByDomain (req, res, next) {
  try {
    const restaurant = await Restaurant.findOne({ domain : req.params.domain });
    const menus = await Menu.find({ restaurant : restaurant._id }).populate('bocas').sort({'createdAt' : 'desc'});
    return res.status(200).json({restaurant, menus});
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

module.exports = {
  createRestaurant,
  restaurantByUser,
  restaurantByDomain,
};