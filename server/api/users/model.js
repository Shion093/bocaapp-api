const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email       : {
    type     : String,
    unique   : true,
    required : true,
    trim     : true
  },
  username    : {
    type     : String,
    unique   : true,
    required : true,
    trim     : true
  },
  password    : {
    type     : String,
    required : true,
  },
  firstName   : { type : String },
  lastName    : { type : String },
  phoneNumber : { type : String },
  role : {
    type    : String,
    enum    : ['user', 'admin', 'superAdmin', 'mod'],
    default : 'user'
  },
}, { timestamps : true });

userSchema.pre('save', function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

userSchema.pre('update', function (next) {
  const user = this;
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
    _id    : user._id,
    email : user.email,
    role  : user.role,
  };

  const options = {
    expiresIn : '5s'
  };
  const refreshOptions = {
    expiresIn : '1m'
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, options);
  const refreshToken = jwt.sign({_id : user._id}, process.env.JWT_SECRET, refreshOptions);

  return {
    token,
    refreshToken,
  };
};

userSchema.methods.refreshTokens = async function (refreshToken) {
  let userId = -1;
  try {
    const { _id } = jwt.decode(refreshToken);
    userId = _id;
  } catch (err) {
    return {};
  }

  if (!userId) {
    return {};
  }

  const user = await this.findOne({ _id: userId });

  if (!user) {
    return {};
  }

  try {
    jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch (err) {
    return {};
  }

  const [newToken, newRefreshToken] = await this.generateToken(user);
  return {
    token: newToken,
    refreshToken: newRefreshToken,
  };
};

module.exports = mongoose.model('user', userSchema);
