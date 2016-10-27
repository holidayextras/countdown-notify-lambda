'use strict';

var environment = process.env.NODE_ENV || 'development';

var Config = {
  ENV: environment,
  GCM_SENDER_ID: process.env.GCM_SENDER_ID,
  MOBILE_APP_SERVICE_URL: 'https://mobile.holidayextras.co.uk',
  APN_GATEWAY: environment === 'production' ? 'gateway.push.apple.com' : 'gateway.sandbox.push.apple.com',
  APN: {
    CERT: process.env.APN_CERT,
    KEY: process.env.APN_KEY
  },
  DYNAMO_DB: {
    REGION: 'eu-west-1',
    KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY
  },
  SUMOLOGIC_URL: process.env.SUMOLOGIC_URL,
  SUMOLOGIC_CODE: process.env.SUMOLOGIC_CODE
};

module.exports = Config;
