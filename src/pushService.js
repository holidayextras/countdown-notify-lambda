'use strict';

const PushNotifications = require('node-pushnotifications');
const moment = require('moment');
const async = require('async');
const AWS = require('./awsConfigured');
const Certs = require('./certs');
const pushConfig = require('./pushConfig');
const scenarios = require('./scenarios');

const docClient = new AWS.DynamoDB.DocumentClient();

const pushService = {};

pushService.run = function(callback) {
  this._startTime = moment();
  this._pushCount = 0;

  console.log('----------------------------------------------------------------------------------');
  console.log('Countdown Push Notification Service');
  console.log('----------------------------------------------------------------------------------');

  Certs.downloadCerts();
  return async.concat(scenarios, this.findEvents, (err, eventsFound) => {
    if (err) {
      return callback(err);
    }

    console.log('Events found: ', eventsFound.length);

    return async.map(eventsFound, this.addDeviceToResult, (err2, eventsAndDevices) => {
      if (err2) {
        return callback(err2);
      }
      let pushableEvents = eventsAndDevices.filter(this.canPush);

      console.log('Pushable events found: ', pushableEvents.length);

      return async.each(pushableEvents, this.sendPushNotification.bind(this), (err3) => {
        if (err3) {
          return callback(err3);
        }
        this.displaySummary();
        return callback(null, 'OK');
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
  console.log('findEvents(): ', scenario);
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
  console.log(eventParams);

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
    title: 'example title',
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
