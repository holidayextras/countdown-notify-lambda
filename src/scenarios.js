'use strict';

const moment = require('moment');

const Scenarios = [
  {
    startTime: moment(),
    label: 'Events in the next hour',
    Android: {
      titleTemplate: 'Countdown to %s',
      messageTemplate: '🚀 Only 1 hour to go 🎉 Have an amazing time!'
    },
    iOS: {
      titleTemplate: '🚀 Only 1 hour until %s! 🎉 Have an amazing time!',
      messageTemplate: 'Reminder'
    }
  },
  {
    startTime: moment().add(1, 'day'),
    label: 'Events in the next day',
    Android: {
      titleTemplate: 'Countdown to %s',
      messageTemplate: "🚀 Only 1 day to go! Share your countdown and bask in the glory of endless ‘likes’. 👍"
    },
    iOS: {
      titleTemplate: "🚀 Only 1 day until %s! Share your countdown and bask in the glory of endless ‘likes’. 👍",
      messageTemplate: 'Reminder'
    }
  },
  {
    startTime: moment().add(2, 'days'),
    label: 'Events in the next two days',
    Android: {
      titleTemplate: 'Countdown to %s',
      messageTemplate: '🚀 Only 2 days to go!'
    },
    iOS: {
      titleTemplate: '🚀 2 days until %s!',
      messageTemplate: 'Reminder'
    }
  },
  {
    startTime: moment().add(3, 'days'),
    label: 'Events in the next three days',
    Android: {
      titleTemplate: 'Countdown to %s',
      messageTemplate: '🚀 Only 3 days to go!'
    },
    iOS: {
      titleTemplate: '🚀 3 days until %s!',
      messageTemplate: 'Reminder'
    }
  },
  {
    startTime: moment().add(1, 'week'),
    label: 'Events in the next week',
    Android: {
      titleTemplate: 'Countdown to %s',
      messageTemplate: '🚀 Only 1 week to go!'
    },
    iOS: {
      titleTemplate: '🚀 1 week until %s!',
      messageTemplate: 'Reminder'
    }
  },
  {
    startTime: moment().add(2, 'weeks'),
    label: 'Events in the next two week',
    Android: {
      titleTemplate: 'Countdown to %s',
      messageTemplate: '🚀 Only 2 weeks to go!'
    },
    iOS: {
      titleTemplate: '🚀 2 weeks until %s!',
      messageTemplate: 'Reminder'
    }
  },
  {
    startTime: moment().add(1, 'month'),
    label: 'Events in the next month',
    Android: {
      titleTemplate: 'Countdown to %s',
      messageTemplate: '🚀 Only 1 month to go!'
    },
    iOS: {
      titleTemplate: '🚀 1 month until %s!',
      messageTemplate: 'Reminder'
    }
  },
  {
    startTime: moment().add(3, 'months'),
    label: 'Events in the next three months',
    Android: {
      titleTemplate: 'Countdown to %s',
      messageTemplate: "🚀 Only 3 months to go! Share your countdown and bask in the glory of endless ‘likes’. 👍"
    },
    iOS: {
      titleTemplate: '🚀 3 months until %s! Share your countdown and bask in the glory of endless ‘likes’. 👍',
      messageTemplate: 'Reminder'
    }
  },
  {
    startTime: moment().add(6, 'months'),
    label: 'Events in the next six months',
    Android: {
      titleTemplate: 'Countdown to %s',
      messageTemplate: "🚀 Only 6 months to go! Share your countdown and bask in the glory of endless ‘likes’. 👍"
    },
    iOS: {
      titleTemplate: '🚀 6 months until %s! Share your countdown and bask in the glory of endless ‘likes’. 👍',
      messageTemplate: 'Reminder'
    }
  },
  {
    startTime: moment().add(1, 'year'),
    label: 'Events in the next year',
    Android: {
      titleTemplate: 'Countdown to %s',
      messageTemplate: "🚀 Only 1 year to go! Share your countdown and bask in the glory of endless ‘likes’. 👍"
    },
    iOS: {
      titleTemplate: '🚀1 year until %s! Share your countdown and bask in the glory of endless ‘likes’. 👍',
      messageTemplate: 'Reminder'
    }
  }
];

module.exports = Scenarios;
