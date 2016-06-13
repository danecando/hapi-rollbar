/**
 * ## hapi-rollbar Joi schema
 *
 * @module schema.js
 * @todo define alternate schema for passing pre-initiated rollbar instance
 */

'use strict';

const Joi = require('joi');

const internals = {};

exports.tokenSchema = internals.tokenSchema = Joi.string().token().required();

exports.configSchema = internals.configSchema = Joi.object().keys({
  environment: Joi.string().default(process.env.NODE_ENV || 'development'),
  scrubFields: Joi.array().items(Joi.string()),
  scrubHeaders: Joi.array().items(Joi.string()).default([]),
  minimumLevel: Joi.string().default('debug'),
  enabled: Joi.boolean().default(true)
});

exports.initSchema = Joi.object().keys({
  accessToken: internals.tokenSchema,
  config: internals.configSchema
});
