'use strict';

const fs = require('fs');
const path = require('path');
const AWS = require('./awsConfigured');

const Certs = {};

Certs._outputDir = '/tmp/certs';
Certs._cert = 'aps.pem';
Certs._key = 'push_services_key.pem';

Certs.certFullPath = function() {
  return path.resolve(path.join(Certs._outputDir, Certs._cert));
};

Certs.keyFullPath = function() {
  return path.resolve(path.join(Certs._outputDir, Certs._key));
};

Certs.downloadCerts = function() {
  Certs._get(Certs._cert);
  Certs._get(Certs._key);
};

Certs._createDirectory = function() {
  if (!fs.existsSync(Certs._outputDir)) {
    fs.mkdirSync(Certs._outputDir);
  }
};

Certs._getRemoteStream = function(file) {
  const params = {
    Bucket: process.env.CERT_BUCKET + '-' + process.env.NODE_ENV,
    Key: file
  };
  const s3 = new AWS.S3();
  return s3.getObject(params).createReadStream();
};

Certs._getLocalStream = function(file) {
  const outputFileName = path.join(Certs._outputDir, file);
  return fs.createWriteStream(outputFileName);
};

Certs._get = function(file) {
  Certs._createDirectory();
  const remoteStream = Certs._getRemoteStream(file);
  const localStream = Certs._getLocalStream(file);
  remoteStream.pipe(localStream);
};

module.exports = Certs;
