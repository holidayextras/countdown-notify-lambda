'use strict';

var fs = require('fs');
var path = require('path');
var AWS = require('./aws_configured');

var Certs = {};

Certs._outputDir = './certs';
Certs.cert = 'aps.pem';
Certs.key = 'push_services_key.pem';

Certs.downloadCerts = function() {
  console.log('_downloadedCerts()');
  Certs._get(Certs.cert);
  Certs._get(Certs.key);
};

Certs._createDirectory = function() {
  if (!fs.existsSync(Certs._outputDir)) {
    fs.mkdirSync(Certs._outputDir);
  }
};

Certs._get = function(file) {
  Certs._createDirectory();
  var bucket = path.join(process.env.CERT_BUCKET, process.env.NODE_ENV);
  const params = {
    Bucket: bucket,
    Key: file
  };
  var s3 = new AWS.S3();
  var readStream = s3.getObject(params).createReadStream();
  const outputFileName = path.join(Certs._outputDir, file);
  const writable = fs.createWriteStream(outputFileName);
  readStream.pipe(writable);
};

module.exports = Certs;