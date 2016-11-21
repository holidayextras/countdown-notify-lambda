'use strict';

const PushNotifications = require('node-pushnotifications');
const moment = require('moment');
const AWS = require('./awsConfigured');
const Certs = require('./certs');
const pushConfig = require('./pushConfig');
const scenarios = require('./scenarios');

const docClient = new AWS.DynamoDB.DocumentClient();

const pushService = {};

pushService.run = function() {
  this._startTime = moment();
  this._pushCount = 0;

  console.log('----------------------------------------------------------------------------------');
  console.log('Countdown Push Notification Service');
  console.log('----------------------------------------------------------------------------------');

  Certs.downloadCerts();

  return Promise.all(this.findAllEvents())
  .then(this.concatResults)
  .then(results => {
    return Promise.all(this.addDevicesToAllEvents(results));
  })
  .then(this.concatResults)
  .then(results => {
    return results.filter(this.canPush);
  })
  .then(results => {
    return Promise.all(this.sendPushNotificationsForAllEvents(results));
  })
  .then(() => {
    this.displaySummary();
  });
};

pushService.concatResults = function(results) {
  return Array.prototype.concat.apply([], results);
};

pushService.sendPushNotificationsForAllEvents = function(pushableEvents) {
  console.log('Found pushable events: ', pushableEvents.length);
  return pushableEvents.map((item) => {
    return new Promise((fulfill, reject) => {
      this.sendPushNotification(item, function(err) {
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
      this.addDeviceToResult(item, function(err, eventAndDevice) {
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
      this.findEvents(item, function(err, eventsFound) {
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
  let duration = moment().diff(this._startTime);
  console.log('----------------------------------------------------------------------------------');
  console.log('Sent ' + this._pushCount + ' push notifications in ' + duration / 1000.0 + ' seconds.');
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
  docClient.query(deviceParams, function(err, results) {
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
  let eventParams = {
    TableName: 'MobAppEvent',
    ProjectionExpression: 'ID, DeviceID, StartDate, TextColour, Background, Destination'
  };
  if (scenario.startTime) {
    eventParams.FilterExpression = 'StartDate >= :min_start and StartDate < :max_start';
    eventParams.ExpressionAttributeValues = {
      ':min_start': scenario.startTime.format(),
      ':max_start': scenario.startTime.add(1, 'hour').format()
    };
  }
  console.log('Event search params: ', eventParams);

  docClient.scan(eventParams, function(err, events) {
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
  let _this = this;
  const data = {
    title: push.Event.Destination,
    message: push.Scenario.message
  };
  const pushId = push.Device.PushID;
  const dispatcher = new PushNotifications(pushConfig);
  return dispatcher.send([pushId], data, function(status) {
    console.log(status);
    _this._pushCount++;
    console.log('Sent push notification to device: ' + push.Device.DeviceID);
    return callback();
  });
};

module.exports = pushService;
