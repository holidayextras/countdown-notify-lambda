/* eslint-disable no-process-exit*/
'use strict';

var NodePush = require('node-pushnotifications');
var PushNotifications = new NodePush();

var AWS = require('aws-sdk');
var _ = require('lodash');
var moment = require('moment');
var config = require('../config.js');
var async = require('async');

AWS.config.update({
  region: config.DYNAMO_DB.REGION,
  accessKeyId: config.DYNAMO_DB.KEY_ID,
  secretAccessKey: config.DYNAMO_DB.SECRET_ACCESS_KEY
});

var docClient = new AWS.DynamoDB.DocumentClient();

var PushService = {

  startTime: null,

  pushQueue: [],
  queueInterval: 1000 / 50, // 1 Second divided by the dynamodb rate limit.
  pushCount: 0,

  pushSettings: {
    gcm: {
      id: config.GCM_SERVER_API_KEY,
      msgcnt: 1,
      dataDefaults: {
        delayWhileIdle: false,
        timeToLive: 4 * 7 * 24 * 3600, // 4 weeks
        retries: 4
      }
    },
    apn: {
      gateway: config.APN_GATEWAY,
      badge: 1,
      defaultData: {
        expiry: 4 * 7 * 24 * 3600, // 4 weeks
        sound: 'ping.aiff'
      },
      options: {
        cert: config.APN.CERT,
        key: config.APN.KEY
      }
    }
  },

  scenarios: [
    {
      startTime: moment(),
      message: 'Events in the next hour'
    },
    {
      startTime: moment().add(1, 'day'),
      message: 'Events in the next day'
    },
    {
      startTime: moment().add(2, 'days'),
      message: 'Events in the next two days'
    },
    {
      startTime: moment().add(3, 'days'),
      message: 'Events in the next three days'
    },
    {
      startTime: moment().add(1, 'week'),
      message: 'Events in the next week'
    },
    {
      startTime: moment().add(2, 'weeks'),
      message: 'Events in the next two week'
    },
    {
      startTime: moment().add(1, 'month'),
      message: 'Events in the next month'
    },
    {
      startTime: moment().add(3, 'months'),
      message: 'Events in the next three months'
    },
    {
      startTime: moment().add(6, 'months'),
      message: 'Events in the next six months'
    },
    {
      startTime: moment().add(1, 'year'),
      message: 'Events in the next year'
    }
  ],

  init: function() {
    var _this = this;

    _this.startTime = moment();

    console.log('----------------------------------------------------------------------------------');
    console.log('Countdown Push Notification Service');
    console.log('----------------------------------------------------------------------------------');

    async.concat(_this.scenarios, _this.findEvents, function(err, results) {
      if (err) {
        console.log(err);
      }

      _this.pushQueue = results;
      return _this.processPushQueue();
    });
  },

  processPushQueue: function() {
    var _this = this;

    if (_this.pushQueue.length === 0) {
      var duration = moment().diff(_this.startTime);

      // Wait for the last job to complete.
      return setTimeout(function() {
        _this.displaySummary(duration);
      }, _this.queueInterval);
    }

    // Pop a job of the push queue.
    _this.sendPushNotification(_this.pushQueue.pop());

    // Run this method again once the queueInterval has elapsed.
    return setTimeout(function() {
      _this.processPushQueue();
    }, _this.queueInterval);
  },

  displaySummary: function(duration) {
    console.log('----------------------------------------------------------------------------------');
    console.log('Sent ' + this.pushCount + ' push notifications in ' + duration / 1000.0 + ' seconds.');
    console.log('----------------------------------------------------------------------------------');

    // Allow time for sumologic to finish syncing.
    setTimeout(function() {
      process.exit();
    }, 1100);
  },

  findDevice: function(deviceId, callback) {
    var deviceParams = {
      TableName: 'MobAppDevice',
      Index: 'DeviceID',
      KeyConditionExpression: 'DeviceID = :device_id',
      ExpressionAttributeValues: {
        ':device_id': deviceId
      }
    };

    docClient.query(deviceParams, function(err, result) {
      if (err) console.log(err);

      callback(err, result);
    });
  },

  findEvents: function(scenario, callback) {
    var eventParams = {
      TableName: 'MobAppEvent',
      ProjectionExpression: 'ID, DeviceID, StartDate, TextColour, Background, Destination',
      FilterExpression: 'StartDate >= :min_start and StartDate < :max_start',
      ExpressionAttributeValues: {
        ':min_start': scenario.startTime.format(),
        ':max_start': scenario.startTime.add(1, 'hour').format()
      }
    };

    docClient.scan(eventParams, function(err, events) {
      if (err) {
        console.log(err);
        return callback(err);
      }

      var pushes = [];

      _.each(events.Items, function(event) {
        pushes.push({
          Event: event,
          Scenario: scenario
        });
      });

      return callback(null, pushes);
    });
  },

  sendPushNotification: function(push) {
    var _this = this;
    var message = push.Scenario.message;

    PushService.findDevice(push.Event.DeviceID, function(err, result) {
      if (err) {
        return console.log(err);
      }

      // Check that the device exists and is capabale of receiving
      // push notifications.
      if (result.Count === 0 || !result.Items[0].PushID) {
        return console.log('Device not registered: ' + push.Event.DeviceID);
      }

      var device = result.Items[0];
      var data = {
        title: message
      };

      var dispatcher = new PushNotifications(PushService.pushSettings);
      return dispatcher.send([device.PushID], data, function() {
        _this.pushCount++;
        return console.log('Sent push notification to device: ' + device.DeviceID);
      });
    });
  }

};

module.exports = PushService;
