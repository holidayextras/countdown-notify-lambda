'use strict';

var PushService = require('./src/pushService');
var SumoLogger = require('sumologic');

// For development/testing purposes
exports.handler = function() {
  // Set up logging for production.
  if (process.env.NODE_ENV === 'production') {
    var logger = new SumoLogger(process.env.SUMOLOGIC_CODE, {
      endpoint: process.env.SUMOLOGIC_URL,
      syncInterval: 1000
    });

    // Print to console and send to SumoLogic.
    logger.augmentConsole();
  }

  // Initialise the push service.
  PushService.init();
};
