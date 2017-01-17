'use strict';

const bunyan = require('bunyan');
const SumoLogger = require('bunyan-sumologic');

const sumoConfig = {
  collector: process.env.SUMOLOGIC_CODE,
  endpoint: process.env.SUMOLOGIC_URL,
  syncInterval: 1000,
  rewriteLevels: true
};

const streams = [{
  stream: process.stdout
}];

if (process.env.NODE_ENV === 'production') {
  streams.push({
    type: 'raw',
    stream: new SumoLogger(sumoConfig)
  });
}

const logger = bunyan.createLogger({
  name: 'countdown-lambda',
  streams: streams
});

module.exports = logger;
