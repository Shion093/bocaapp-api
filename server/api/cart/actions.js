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
    const { item, cartId, add } = req.body;
    const { _id : userId, isActive } = req.user;
    if (isActive) {
      let cart;
      const existingCart = await Cart.findOne({
        user           : userId,
        _id            : cartId,
        restaurant     : item.restaurant,
        'products._id' : item._id,
      });
      if (existingCart) {
        const product = _.find(existingCart.products, { _id : item._id });
        const newQty = add ? product.qty + 1 : product.qty - 1;
        if (product.qty === 1 && !add) {
          cart = await Cart.findOneAndUpdate({
              user           : userId,
              _id            : cartId,
              'products._id' : item._id,
            },
            { $pull : { products : { _id : item._id } } }, { new : true });
        } else {
          cart = await Cart.findOneAndUpdate({
              user           : userId,
              _id            : cartId,
              'products._id' : item._id,
              restaurant     : item.restaurant,
            },
            { $set : { 'products.$.qty' : newQty } }, { new : true });
        }
      } else {
        item.qty = 1;
        cart = await Cart.findOneAndUpdate({ user : userId },
          {
            restaurant : item.restaurant,
            $push      : {
              products : {
                ...item,
              }
            }
          }, { new : true, upsert : true });
      }
      cart.calculatesPrices();
      return res.status(200).json(cart);
    }
    return res.status(401).json({ error : 'Unauthorized' });
  } catch (err) {
    return errorHandler(err, req, res);
  }
}

async function removeFromCart (req, res, next) {
  try {
    const { cartId, itemId, userId } = req.body;
    const cart = await Cart.findOneAndUpdate({
        user           : userId,
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