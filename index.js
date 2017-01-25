'use strict';

var pushService = require('./src/pushService');
const logger = require('./src/logger');

exports.handler = function(event, context, callback) {
  // node-pushnotifications seems to leave some code on the event loop that prevents the function
  // from ending (until timeout) only when it is uploaded to AWS.
  context.callbackWaitsForEmptyEventLoop = false;
  const waitForExit = func => setTimeout(func, 2000);
  pushService.run()
  .then(function() {
    logger.info('Service Completed');
    waitForExit(() => callback(null, 'OK'));
  })
  .catch(function(err) {
    logger.error(err);
    waitForExit(() => callback(err));
  });
};
