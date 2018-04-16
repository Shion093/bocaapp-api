const mongoose = require('mongoose');
const _ = require('lodash');

const orderStatus = ['Procesando', 'En cocina', 'Lista'];

const orderSchema = new mongoose.Schema({
  user     : {
    type : mongoose.Schema.Types.ObjectId,
    ref  : 'User',
  },
  products : [],
  total    : { type : Number },
  tax      : { type : Number },
  subTotal : { type : Number },
  status   : { type : String, enum : orderStatus, default : 'Procesando' }
}, { timestamps : true });

module.exports = mongoose.model('Order', orderSchema);
