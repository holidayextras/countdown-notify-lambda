'use strict';

const Certs = require('./certs');

const settings = {
  gcm: {
    id: process.env.GCM_SERVER_API_KEY,
    msgcnt: 1,
    dataDefaults: {
      delayWhileIdle: false,
      timeToLive: 4 * 7 * 24 * 3600, // 4 weeks
      retries: 4
    }
  },
  apn: {
    gateway: process.env.APN_GATEWAY,
    badge: 1,
    defaultData: {
      expiry: 4 * 7 * 24 * 3600, // 4 weeks
      sound: 'ping.aiff'
    },
    // See all available options at https://github.com/argon/node-apn/blob/master/doc/connection.markdown
    options: {
      cert: Certs.certFullPath(),
      key: Certs.keyFullPath()
    }
  }
};

module.exports = settings;
