const Joi = require('joi');

module.exports = {
  // POST /v1/menu/create
  menu: {
    body: {
      description: Joi.string().min(6).required(),
      picture: Joi.string().min(6).required(),
      name: Joi.string().max(128),
    },
  },
};