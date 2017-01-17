'use strict';

const bunyan = require('bunyan');
const SumoLogger = require('bunyan-sumologic');

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

const streams = [{
  level: LOG_LEVEL,
  stream: process.stdout
}];

if (process.env.NODE_ENV === 'production') {
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

const logger = bunyan.createLogger({
  name: 'countdown-lambda',
  streams: streams
});

module.exports = logger;
