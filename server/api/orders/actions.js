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
    const newOrder = new Order(order);
    newOrder.orderNumber = await newOrder.getOrderNumber();
    await newOrder.save();
    await cart.remove();
    return res.status(200).json(newOrder);
  } catch (err) {
    console.log(err);
    return errorHandler(err, req, res);
  }
}

async function userOrders (req, res, next) {
  try {
    const orders = await Order.find({
      user : req.params.userId,
    });
    return res.status(200).json(orders);
  } catch (err) {
    console.log(err);
    return errorHandler(err, req, res);
  }
}

async function reOrder (req, res, next) {
  try {
    const order = await Order.findOne({
      _id : req.body.orderId,
    });
    const cart = await Cart.findOneAndUpdate(
      { user : req.body.userId },
      { $set : { products : order.products } },
      { new : true }
    );
    cart.calculatesPrices();
    return res.status(200).json(cart);
  } catch (err) {
    console.log(err);
    return errorHandler(err, req, res);
  }
}

module.exports = {
  createOrder,
  userOrders,
  reOrder,
};