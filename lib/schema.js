'use strict';

const Joi = require('joi');

exports.options = Joi.object().keys({
  env: Joi.string().default(process.env.NODE_ENV || 'development'),
  active: Joi.boolean().default(true),
  exitOnUncaughtExceptions: Joi.boolean().default(false),
  token: Joi.string().required()
});
