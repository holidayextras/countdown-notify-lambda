'use strict';

const PushNotifications = require('node-pushnotifications');
const moment = require('moment');
const async = require('async');
const AWS = require('./aws_configured');
const Certs = require('./certs');
const pushConfig = require('./push_config');
const scenarios = require('./scenarios');

const docClient = new AWS.DynamoDB.DocumentClient();

const PushService = {

  startTime: null,

  queueInterval: 1000 / 50, // 1 Second divided by the dynamodb rate limit.
  pushCount: 0,

  init: function(callback) {
    this.startTime = moment();

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

        return async.each(eventsFound, this.sendPushNotification.bind(this), (err3) => {
          if (err3) {
            return callback(err3);
          }
          this.displaySummary();
          return callback(null, 'OK');
        });
      });
    });
  },

  canPush: function(item) {
    return item.Device && item.Device.PushID;
  },

  displaySummary: function() {
    var duration = moment().diff(this.startTime);
    console.log('----------------------------------------------------------------------------------');
    console.log('Sent ' + this.pushCount + ' push notifications in ' + duration / 1000.0 + ' seconds.');
    console.log('----------------------------------------------------------------------------------');
  },

  addDeviceToResult: function(result, callback) {
    let deviceId = result.Event.DeviceID;
    var deviceParams = {
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
  },

  findEvents: function(scenario, callback) {
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
  },

  sendPushNotification: function(push, callback) {
    console.log('sendPushNotification()', push);
    var _this = this;
    const data = {
      title: 'example title',
      message: push.Scenario.message
    };
    const pushId = push.Device.PushID;
    const dispatcher = new PushNotifications(pushConfig);
    return dispatcher.send([pushId], data, function(status) {
      console.log(status);
      _this.pushCount++;
      console.log('Sent push notification to device: ' + push.Device.DeviceID);
      return callback();
    });
  }

};

module.exports = PushService;
