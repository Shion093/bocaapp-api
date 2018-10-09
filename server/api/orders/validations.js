const Joi = require('joi');

module.exports = {
  // POST /v1/products/create
  product   : {
    body : {
      description : Joi.string().min(6).required(),
      price       : Joi.number().required(),
      name        : Joi.string().max(128),
    },
  },
  // POST /v1/products/assign
  assign : {
    body : {
      menuId : Joi.string().min(6).required(),
      productId : Joi.string().min(6).required(),
    },
  },
};