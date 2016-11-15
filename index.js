'use strict';

var PushService = require('./src/pushService');
var SumoLogger = require('sumologic');

// For development/testing purposes
exports.handler = function(event, context, callback) {

  // node-pushnotifications seems to leave some code on the event loop that prevents the function
  // from ending (until timeout) only when it is uploaded to AWS.
  context.callbackWaitsForEmptyEventLoop = false;

  // Set up logging for production.
  if (process.env.NODE_ENV === 'production') {
    var logger = new SumoLogger(process.env.SUMOLOGIC_CODE, {
      endpoint: process.env.SUMOLOGIC_URL,
      syncInterval: 1000
    });

    // Print to console and send to SumoLogic.
    logger.augmentConsole();
  }

  PushService.init(callback);
};
