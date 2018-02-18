const Joi = require('joi');

module.exports = {
  // POST /v1/bocas/create
  boca: {
    body: {
      description : Joi.string().min(6).required(),
      picture     : Joi.string().min(6).required(),
      name        : Joi.string().max(128),
      menu        : Joi.string().max(128),
    },
  },
};