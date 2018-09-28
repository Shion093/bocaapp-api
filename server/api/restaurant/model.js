const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  admin       : {
    type : mongoose.Schema.Types.ObjectId,
    ref  : 'User',
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
  domain      : {
    unique : true,
    type   : String,
  },
  isOpen: {
    type    : Boolean,
    default : true,
  }
}, { timestamps : true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
