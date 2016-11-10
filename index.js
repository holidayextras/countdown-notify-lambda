'use strict';

var PushService = require('./src/pushService');
var SumoLogger = require('sumologic');
var config = require('./generated/config');

// For development/testing purposes
exports.handler = function() {
  // Set up logging for production.
  if (config.NODE_ENV === 'production') {
    var logger = new SumoLogger(config.SUMOLOGIC_CODE, {
      endpoint: config.SUMOLOGIC_URL,
      syncInterval: 1000
    });

    // Print to console and send to SumoLogic.
    logger.augmentConsole();
  }

  // Initialise the push service.
  PushService.init();
};
