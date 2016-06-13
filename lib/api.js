/**
 * ## hapi-rollbar api
 *
 * API to provide a deep and baller harmony between your Hapi
 * application and the Rollbar node module.
 *
 * @module api.js
 */

'use strict';

const internals = {};
internals.noop = () => {};


/**
 * ### marshalRequest
 *
 * Since everything is still built like express is the only
 * Node web framework; We need to marshal the Hapi request
 * object to match the format rollbar's api is expecting.
 *
 * @param {Hapi.Request} request
 * @returns {object} request data attached to rollbar logs for extra context
 */
exports.marshalRequest = internals.marshalRequest = (request) => ({
  headers: request.headers,
  url: request.path,
  method: request.method,
  body: request.payload,
  route: request.route
});

exports.logInfo = function (msg, level, req, cb) {
  this.reportMessage(
    msg,
    level || 'info',
    req ? internals.marshalRequest(req) : {},
    cb || internals.noop
  );
};

exports.logError = function (err, req, cb) {
  this.handleError(
    err,
    req ? internals.marshalRequest(req) : {},
    cb || internals.noop
  );
};

exports.logReq = function (req, err, data, cb) {
  this.reportMessageWithPayloadData(
    err,
    Object.assign({ level: 'info' }, data || {}),
    internals.marshalRequest(req),
    cb || internals.noop
  );
};

exports.logReqError = function (req, err, data, cb) {
  this.handleErrorWithPayloadData(
    err,
    Object.assign(data || {}, { level: 'error' }),
    internals.marshalRequest(req),
    cb || internals.noop
  );
};
