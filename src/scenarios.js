'use strict';

const moment = require('moment');

const Scenarios = [
  {
    startTime: null,
    message: 'All events'
  },
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
];

module.exports = Scenarios;
