'use strict';

const moment = require('moment');

const Scenarios = [
  {
    startTime: moment(),
    label: 'Events in the next hour',
    messageTemplate: '🚀 Only 1 hour until %s! 🎉 Have an amazing time!'
  },
  {
    startTime: moment().add(1, 'day'),
    label: 'Events in the next day',
    messageTemplate: "🚀 Only 1 day until %s! Share your countdown and bask in the glory of endless ‘likes’. 👍"
  },
  {
    startTime: moment().add(2, 'days'),
    label: 'Events in the next two days',
    messageTemplate: '🚀 Only 2 days until %s!'
  },
  {
    startTime: moment().add(3, 'days'),
    label: 'Events in the next three days',
    messageTemplate: '🚀 Only 3 days until %s!'
  },
  {
    startTime: moment().add(1, 'week'),
    label: 'Events in the next week',
    messageTemplate: '🚀 Only 1 week until %s!'
  },
  {
    startTime: moment().add(2, 'weeks'),
    label: 'Events in the next two week',
    messageTemplate: '🚀 Only 2 weeks until %s!'
  },
  {
    startTime: moment().add(1, 'month'),
    label: 'Events in the next month',
    messageTemplate: '🚀 Only 1 month until %s!'
  },
  {
    startTime: moment().add(3, 'months'),
    label: 'Events in the next three months',
    messageTemplate: "🚀 Only 3 months until %s! Share your countdown and bask in the glory of endless ‘likes’. 👍"
  },
  {
    startTime: moment().add(6, 'months'),
    label: 'Events in the next six months',
    messageTemplate: "🚀 Only 6 months until %s! Share your countdown and bask in the glory of endless ‘likes’. 👍"
  },
  {
    startTime: moment().add(1, 'year'),
    label: 'Events in the next year',
    messageTemplate: "🚀 Only 1 year until New York! Share your countdown and bask in the glory of endless ‘likes’. 👍"
  }
];

module.exports = Scenarios;
