'use strict';

const bunyan = require('bunyan');
const SumoLogger = require('bunyan-sumologic');

const logger = module.exports = {};
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

logger._setupStreams = function(environment) {
  const streams = [{
    level: LOG_LEVEL,
    stream: process.stdout
  }];

  if (environment === 'production') {
    const sumoConfig = {
      collector: process.env.SUMOLOGIC_CODE,
      endpoint: process.env.SUMOLOGIC_URL,
      syncInterval: 1000,
      rewriteLevels: true
    };

    streams.push({
      level: LOG_LEVEL,
      type: 'raw',
      stream: new SumoLogger(sumoConfig)
    });
  }

  return streams;
};

logger.setupLogging = function() {
  return bunyan.createLogger({
    name: 'countdown-lambda',
    streams: logger._setupStreams(process.env.NODE_ENV)
  });
};
