const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  author      : {
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
  picture     : {
    type : String,
  },
  bocas : [{
    type : mongoose.Schema.Types.ObjectId,
    ref  : 'Boca',
  }]
}, { timestamps : true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
