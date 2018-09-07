const mongoose = require('mongoose');
const _ = require('lodash');

const orderStatus = ['Procesando', 'En cocina', 'Lista', 'Entregada'];

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  user        : {
    type : mongoose.Schema.Types.ObjectId,
    ref  : 'User',
  },
  restaurant  : {
    type : mongoose.Schema.Types.ObjectId,
    ref  : 'Restaurant',
  },
  orderNumber : { type : Number },
  products    : [],
  total       : { type : Number },
  tax         : { type : Number },
  subTotal    : { type : Number },
  location    : { type: pointSchema, required: true },
  address     : { },
  status      : { type : String, enum : orderStatus, default : 'Procesando' }
}, { timestamps : true });

const counterSchema = new mongoose.Schema({
  name       : { type : String },
  restaurant : {
    type : mongoose.Schema.Types.ObjectId,
    ref  : 'Restaurant',
  },
  counter    : { type : Number },
});

const counter = mongoose.model('Counter', counterSchema);

orderSchema.methods.getOrderNumber = function (restId) {
  return counter.findOneAndUpdate(
    { name : 'orderNumbers', restaurant : restId },
    { $inc : { counter : 1 } },
    { new : true, upsert : true }
  ).then((result) => result.counter);
};

module.exports = mongoose.model('Order', orderSchema);
