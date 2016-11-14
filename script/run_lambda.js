'use strict';

require('dotenv').config();
const AWS = require('../src/aws_configured');

const lambda = new AWS.Lambda();

const params = {
  FunctionName: process.env.AWS_FUNCTION_NAME + '-' + process.env.NODE_ENV
};

lambda.invoke(params, function(err, data) {
  console.log(err, data);
});
