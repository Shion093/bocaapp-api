const Joi = require('joi');

module.exports = {
  // POST /v1/bocas/create
  boca   : {
    body : {
      description : Joi.string().min(6).required(),
      price       : Joi.number().required(),
      name        : Joi.string().max(128),
    },
  },
  // POST /v1/bocas/assign
  assign : {
    body : {
      menuId : Joi.string().min(6).required(),
      bocaId : Joi.string().min(6).required(),
    },
  },
};