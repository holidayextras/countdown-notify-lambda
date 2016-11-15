'use strict';

var AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.FORCED_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.FORCED_AWS_SECRET_ACCESS_KEY
});

module.exports = AWS;
