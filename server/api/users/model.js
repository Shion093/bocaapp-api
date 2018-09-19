const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email            : {
    type     : String,
    unique   : true,
    required : true,
    trim     : true
  },
  password         : {
    type     : String,
    required : true,
  },
  username         : {
    type   : String,
    unique : true,
  },
  firstName        : { type : String },
  lastName         : { type : String },
  phoneNumber      : { type : String },
  verificationCode : { type : String },
  isActive         : { type : Boolean },
  role             : {
    type    : String,
    enum    : ['user', 'admin', 'superAdmin', 'mod'],
    default : 'user'
  },
  restaurant       : {
    type : mongoose.Schema.Types.ObjectId,
    ref  : 'Restaurant',
  }
}, { timestamps : true });

userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

userSchema.pre('update', function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

userSchema.methods.comparePassword = function (candidatePassword) {
  const password = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, password, (err, success) => {
      if (err) return reject(err);
      return resolve(success);
    });
  });
};

userSchema.methods.generateToken = function generateToken (user) {
  const payload = {
    _id   : user._id,
    email : user.email,
    role  : user.role,
  };

  const options = {
    expiresIn : '1h'
  };
  const refreshOptions = {
    expiresIn : '7d'
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, options);
  const refreshToken = jwt.sign({ _id : user._id }, process.env.JWT_SECRET, refreshOptions);

  return {
    token,
    refreshToken,
  };
};

module.exports = mongoose.model('User', userSchema);
