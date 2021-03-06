const _ = require('lodash');
const { handler : errorHandler } = require('../../middlewares/errors');
const Cart = require('../cart/model');
const Order = require('./model');

async function createOrder (req, res, next) {
  try {
    if (req.user.isActive) {
      const cart = await Cart.findOne({
        user : req.body.userId,
      });
      const { lng, lat } = req.body.location;
      const order = _.omit(cart.toJSON(), ['_id', 'createdAt', 'updatedAt', '__v']);
      order.address = req.body.address.address;
      order.detail = req.body.address.detail;
      order.location = { type : 'Point', coordinates : [lat, lng] };
      const newOrder = new Order(order);
      newOrder.orderNumber = await newOrder.getOrderNumber();
      await newOrder.save();
      await cart.remove();
      return res.status(200).json(newOrder);
    }
    return res.status(401).json({ error : 'Unauthorized' });
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function userOrders (req, res, next) {
  try {
    const orders = await Order.find({
      user : req.params.userId,
    }).sort({ createdAt : 'desc' });
    return res.status(200).json(orders);
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function allOrders (req, res, next) {
  try {
    const orders = await Order.find({
      restaurant : req.user.restaurant
    }).populate('user')
      .sort({ createdAt : 'desc' });
    return res.status(200).json(orders);
  } catch (err) {
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
      { new : true, upsert : true }
    );
    cart.calculatesPrices();
    return res.status(200).json(cart);
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function changeOrderStatus (req, res, next) {
  try {
    const order = await Order.findOneAndUpdate(
      { _id : req.body.orderId },
      { $set : { status : req.body.status } },
      { new : true }
    );
    const orders = await Order.find({}).sort({ createdAt : 'desc' });
    return res.status(200).json(orders);
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

module.exports = {
  createOrder,
  userOrders,
  reOrder,
  allOrders,
  changeOrderStatus,
};