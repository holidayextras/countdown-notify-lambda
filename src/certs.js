'use strict';

const fs = require('fs');
const path = require('path');
const AWS = require('./aws_configured');

var Certs = {};

Certs._outputDir = './certs';
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

Certs._get = function(file) {
  Certs._createDirectory();
  const params = {
    Bucket: process.env.CERT_BUCKET + '-' + process.env.NODE_ENV,
    Key: file
  };
  const s3 = new AWS.S3();
  const readStream = s3.getObject(params).createReadStream();
  const outputFileName = path.join(Certs._outputDir, file);
  const writable = fs.createWriteStream(outputFileName);
  readStream.pipe(writable);
};

module.exports = Certs;
