const mongoose = require('mongoose');

const Menu = require('../menus/model');

const productSchema = new mongoose.Schema({
  author      : {
    type : mongoose.Schema.Types.ObjectId,
    ref  : 'User',
  },
  menu        : {
    type : mongoose.Schema.Types.ObjectId,
    ref  : 'Menu',
  },
  store  : {
    type : mongoose.Schema.Types.ObjectId,
    ref  : 'Store',
  },
  assigned    : {
    type    : Boolean,
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
  price       : {
    type : Number
  },
  quantity : {
    type : Number
  }
}, { timestamps : true });

productSchema.pre('remove', function (next) {
  if (this.menu) {
    Menu.update(
      { _id : this.menu },
      { $pull : { products : this._id } },
      { multi : true })
      .exec();
    next();
  }
});

module.exports = mongoose.model('Product', productSchema);
