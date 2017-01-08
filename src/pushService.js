'use strict';

const PushNotifications = require('node-pushnotifications');
const moment = require('moment');
const AWS = require('./awsConfigured');
const Certs = require('./certs');
const pushConfig = require('./pushConfig');
const scenarios = require('./scenarios');

const pushService = {};

pushService.run = function() {
  pushService._startTime = moment();
  pushService._pushCount = 0;

  console.log('----------------------------------------------------------------------------------');
  console.log('Countdown Push Notification Service - started at: ' + pushService._startTime.format());
  console.log('----------------------------------------------------------------------------------');

  Certs.downloadCerts();

  return Promise.all(pushService.findAllEvents())
  .then(pushService.concatResults)
  .then(results => {
    return Promise.all(pushService.addDevicesToAllEvents(results));
  })
  .then(pushService.concatResults)
  .then(results => {
    return results.filter(pushService.canPush);
  })
  .then(results => {
    return Promise.all(pushService.sendPushNotificationsForAllEvents(results));
  })
  .then(() => {
    pushService.displaySummary();
  });
};

pushService.concatResults = function(results) {
  return Array.prototype.concat.apply([], results);
};

pushService.sendPushNotificationsForAllEvents = function(pushableEvents) {
  console.log('Found pushable events: ', pushableEvents.length);
  return pushableEvents.map((item) => {
    return new Promise((fulfill, reject) => {
      pushService.sendPushNotification(item, function(err) {
        if (err) {
          return reject(err);
        }
        return fulfill();
      });
    });
  });
};

pushService.addDevicesToAllEvents = function(events) {
  console.log('Found events: ', events.length);
  return events.map((item) => {
    return new Promise((fulfill, reject) => {
      pushService.addDeviceToResult(item, function(err, eventAndDevice) {
        if (err) {
          return reject(err);
        }
        return fulfill(eventAndDevice);
      });
    });
  });
};

pushService.findAllEvents = function() {
  return scenarios.map((item) => {
    return new Promise((fulfill, reject) => {
      pushService.findEvents(item, function(err, eventsFound) {
        if (err) {
          return reject(err);
        }
        return fulfill(eventsFound);
      });
    });
  });
};

pushService.canPush = function(item) {
  return item.Device && item.Device.PushID;
};

pushService.displaySummary = function() {
  let duration = moment().diff(pushService._startTime);
  console.log('----------------------------------------------------------------------------------');
  console.log('Sent ' + pushService._pushCount + ' push notifications in ' + duration / 1000.0 + ' seconds.');
  console.log('----------------------------------------------------------------------------------');
};

pushService.addDeviceToResult = function(result, callback) {
  const deviceId = result.Event.DeviceID;
  const deviceParams = {
    TableName: 'MobAppDevice',
    //Index: 'DeviceID',
    KeyConditionExpression: 'DeviceID = :device_id',
    ExpressionAttributeValues: {
      ':device_id': deviceId
    }
  };
  pushService._getDocClient().query(deviceParams, function(err, results) {
    if (err) {
      return callback(err);
    }
    if (results.Count > 0) {
      result.Device = results.Items[0];
    }
    return callback(null, result);
  });
};

pushService.findEvents = function(scenario, callback) {
  console.log('Finding events for scenario: ', scenario.label);
  let eventParams = {
    TableName: 'MobAppEvent',
    IndexName: 'NotificationIndex',
    ProjectionExpression: 'ID, DeviceID, StartDate, Destination',
    KeyConditionExpression: 'SchemaVersion = :schema AND StartDate BETWEEN :min_start AND :max_start',
    FilterExpression: 'IsDraft = :false AND IsRemoved = :false',
    ExpressionAttributeValues: {
      ':min_start': scenario.startTime.format(),
      ':max_start': scenario.startTime.add(1, 'hour').format(),
      ':false': false,
      ':schema': 2
    }
  };
  console.log('Event search params: ', JSON.stringify(eventParams, null, 2));

  pushService._getDocClient().query(eventParams, function(err, events) {
    if (err) {
      return callback(err);
    }

    let pushes = events.Items.map(function(event) {
      return {
        Event: event,
        Scenario: scenario
      };
    });

    return callback(null, pushes);
  });
};

pushService.sendPushNotification = function(push, callback) {
  console.log('sendPushNotification()', push);
  const pushId = push.Device.PushID;
  const data = pushService._generatePushData(push);
  console.log('push data: ', data);
  const dispatcher = new PushNotifications(pushConfig);
  return dispatcher.send([pushId], data, function(status) {
    console.log('dispatcher status: ', status);
    pushService._pushCount++;
    console.log('Sent push notification to device: ' + push.Device.DeviceID);
    return callback();
  });
};

pushService._generatePushData = function(push) {
  let title = push.Scenario[push.Device.Platform].titleTemplate.replace('%s', push.Event.Destination);
  let message = push.Scenario[push.Device.Platform].messageTemplate.replace('%s', push.Event.Destination);
  return {
    title: title,
    message: message,
    custom: {
      type: 'reminder',
      eventId: push.Event.ID
    }
  };
};

pushService._getDocClient = function() {
  if (!pushService._docClient) {
    pushService._docClient = new AWS.DynamoDB.DocumentClient();
  }
  return pushService._docClient;
};

module.exports = pushService;
