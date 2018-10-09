const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  author      : {
    type : mongoose.Schema.Types.ObjectId,
    ref  : 'User',
  },
  store  : {
    type     : mongoose.Schema.Types.ObjectId,
    ref      : 'store',
    required : true,
  },
  description : {
    type  : String,
    index : true,
    trim  : true,
  },
  name        : {
    type      : String,
    maxlength : 128,
    index     : true,
    trim      : true,
  },
  picture     : {
    type : String,
  },
  products       : [{
    type : mongoose.Schema.Types.ObjectId,
    ref  : 'Product',
  }]
}, { timestamps : true });

module.exports = mongoose.model('Menu', menuSchema);
