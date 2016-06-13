/**
 * # hapi-rollbar
 *
 * Hapi plugin for rollbar logging
 *
 * @todo
 *  * accept pre-init'd rollbar instance
 *  * write tests
 *  * option to switch off default event logging
 *  * bug with custom level not being set properly
 */


'use strict';

const Joi = require('joi');
const Rollbar = require('rollbar');
const Api = require('./api');
const Schema = require('./schema');

exports.register = function (server, options, next) {
  const validation = Joi.validate(options, Schema.initSchema);
  if (!validation || validation.error) throw validation.error;

  const opts = validation.value || options;
  Rollbar.init(opts.accessToken, opts.config);


  // hook into hapi default logging events
  server.on('internalError', Api.logReqError.bind(Rollbar));

  server.on('request', (request, event, tags) => {
    if (!event || event.internal) return;
    const hasTags = (tags && typeof tags === 'object');
    const logFn = (hasTags && tags.hasOwnProperty('error'))
      ? Api.logReqError.bind(Rollbar) : Api.logReq.bind(Rollbar);
    event.level = hasTags ? Object.keys(tags).pop() : 'info';
    logFn(request, event.data, event);
  });

  server.on('log', (event, tags) => {
    if (!event || event.internal) return;
    const level = (tags && typeof tags === 'object')
      ? Object.keys(tags).pop() : 'info';
    Api.logInfo.call(Rollbar, event.data, level);
  });


  // log unhandled exceptions & promise rejections
  process.on('uncaughtException', Api.logError.bind(Rollbar));
  process.on('unhandledRejection', Api.logError.bind(Rollbar));


  // register plugin api methods
  server.decorate('server', 'logInfo', Api.logInfo.bind(Rollbar));
  server.decorate('server', 'logError', Api.logError.bind(Rollbar));
  server.decorate('request', 'logReq', (request) => Api.logReq.bind(Rollbar, request), {apply: true});
  server.decorate('request', 'logReqError', (request) => Api.logReqError.bind(Rollbar, request), {apply: true});


  // expose rollbar instance to server
  server.expose('rollbar', Rollbar);


  return next();
};


exports.register.attributes = {
  pkg: require('../package.json')
};
