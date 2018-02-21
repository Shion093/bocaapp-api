const mongoose = require('mongoose');

const bocaSchema = new mongoose.Schema({
  author      : {
    type : mongoose.Schema.Types.ObjectId,
    ref  : 'User',
  },
  menu      : {
    type : mongoose.Schema.Types.ObjectId,
    ref  : 'Menu',
  },
  assigned : {
    type : Boolean,
    default : false,
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
    trim : true,
  },
  price : {
    type : Number
  }
}, { timestamps : true });

module.exports = mongoose.model('Boca', bocaSchema);
