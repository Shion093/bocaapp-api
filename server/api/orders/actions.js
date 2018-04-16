const shortid = require('shortid');
const _ = require('lodash');
const { handler : errorHandler } = require('../../middlewares/errors');
const Cart = require('../cart/model');
const Order = require('./model');

async function createOrder (req, res, next) {
  try {
    const cart = await Cart.findOne({
      user : req.body.userId,
    });
    const order = _.omit(cart.toJSON(), ['_id', 'createdAt', 'updatedAt', '__v']);
    console.log(order);
    const newOrder = new Order(order);
    await newOrder.save();
    await cart.remove();
    return res.status(200).json(newOrder);
  } catch (err) {
    console.log(err);
    return errorHandler(err, req, res);
  }
}

module.exports = {
  createOrder,
};