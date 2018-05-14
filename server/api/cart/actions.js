const shortid = require('shortid');
const _ = require('lodash');
const { handler : errorHandler } = require('../../middlewares/errors');
const Cart = require('./model');
const Menu = require('../menus/model');
const { optimizeImage } = require('../../helpers/image');
const uploadS3 = require('../../helpers/s3');

async function getCart (req, res, next) {
  try {
    let cart = await Cart.findOne({ user : req.params.userId, restaurant : req.params.restId });
    if (_.isNull(cart)) {
      cart = new Cart({
        user       : req.params.userId,
        restaurant : req.params.restId,
        products   : [],
        tax        : 0,
        subtotal   : 0,
        total      : 0,
      });
      await cart.save();
    }
    return res.status(200).json(cart);
  } catch (err) {
    return errorHandler(error, req, res);
  }
}

async function createCart (req, res, next) {
  try {
    const boca = await (new Cart(req.body)).save();
    return res.status(200).json(boca);
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function addToCart (req, res, next) {
  try {
    const { item, cartId } = req.body;
    let cart;
    const existingCart = await Cart.findOne({
      user           : '5a8e6d8491d11a0956875739',
      _id            : cartId,
      'products._id' : item._id,
    });
    if (existingCart) {
      const product = _.find(existingCart.products, { _id : item._id });
      const newQty = product.qty + 1;
      cart = await Cart.findOneAndUpdate({
          user           : '5a8e6d8491d11a0956875739',
          _id            : cartId,
          'products._id' : item._id
        },
        { $set : { 'products.$.qty' : newQty } }, { new : true });
    } else {
      item.qty = 1;
      cart = await Cart.findOneAndUpdate({ user : '5a8e6d8491d11a0956875739' },
        {
          $push      : {
            products : {
              ...item,
            }
          }
        }, { new : true, upsert : true });
    }
    cart.calculatesPrices();
    return res.status(200).json(cart);
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function removeFromCart (req, res, next) {
  try {
    const { cartId, itemId } = req.body;
    const cart = await Cart.findOneAndUpdate({
        user           : '5a8e6d8491d11a0956875739',
        _id            : cartId,
        'products._id' : itemId,
      },
      { $pull : { products : { _id : itemId } } }, { new : true });
    cart.calculatesPrices();
    return res.status(200).json(cart);
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

module.exports = {
  createCart,
  getCart,
  addToCart,
  removeFromCart,
};