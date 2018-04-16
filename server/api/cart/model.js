const mongoose = require('mongoose');
const _ = require('lodash');

const cartSchema = new mongoose.Schema({
  user     : {
    type : mongoose.Schema.Types.ObjectId,
    ref  : 'User',
  },
  products : [],
  total    : { type : Number },
  tax      : { type : Number },
  subTotal : { type : Number },
}, { timestamps : true });

cartSchema.methods.calculatesPrices = function () {
  const products = this.products;
  const subTotal = _.sumBy(products, (product) => product.price * product.qty);
  const tax = subTotal * 0.13;
  this.subTotal = subTotal;
  this.tax = tax;
  this.total = subTotal + tax;
  this.save();
};

module.exports = mongoose.model('Cart', cartSchema);
