const mongoose = require('mongoose');

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

module.exports = mongoose.model('Cart', cartSchema);
