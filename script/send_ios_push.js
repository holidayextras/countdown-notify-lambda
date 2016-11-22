'use strict';
// Example script to send a push notification to iOS

const pushConfig = require('./pushConfig');
const PushNotifications = require('node-pushnotifications');

var deviceId = process.argv[2];

if (!deviceId) {
  console.log('Device ID required');
}
console.log('Sending to: ', deviceId);

var data = {
  title: 'New push notification',
  message: 'APNS push: ' + (new Date()).getTime()
};
console.log('Sending: ', data);

var push = new PushNotifications(pushConfig);
push.send(deviceId, data, function(result) {
  console.log('Result:', result);
  process.exit(0);  // eslint-disable-line no-process-exit
});
