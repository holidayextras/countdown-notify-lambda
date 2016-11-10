'use strict';
// Example script to send a push notification to iOS

var deviceId = process.argv[2];

if (!deviceId) {
  console.log('Device ID required');
}
console.log('Sending to: ', deviceId);

var PushNotifications = require('node-pushnotifications');

var settings = {
  apn: {
    gateway: 'gateway.sandbox.push.apple.com',
    badge: 1,
    defaultData: {
      expiry: 4 * 7 * 24 * 3600, // 4 weeks
      sound: 'ping.aiff'
    },
    // See all available options at https://github.com/argon/node-apn/blob/master/doc/connection.markdown
    options: {
      cert: '/Users/mark.terry/Documents/mobile_app_certs/countdown/aps_development.pem',
      key: '/Users/mark.terry/Documents/mobile_app_certs/countdown/development_push_services_key.pem'
    }
  }
};
var data = {
  title: 'New push notification',
  message: 'APNS push: ' + (new Date()).getTime()
};
console.log('Sending: ', data);

var push = new PushNotifications(settings);
push.send(deviceId, data, function(result) {
  console.log('Result:', result);
  process.exit(0);  // eslint-disable-line no-process-exit
});
