'use strict';

const AWS = require('aws-sdk');
AWS.config.update({ accessKeyId: 'myKeyId', secretAccessKey: 'secretKey', region: 'us-east-1' });
const dynamodb = new AWS.DynamoDB(
  {
    'endpoint': new AWS.Endpoint('http://localhost:8001'),
    region: 'us-east-1'
  }
);

const tables = [{
  'AttributeDefinitions': [
    {
      'AttributeName': 'DeviceID',
      'AttributeType': 'S'
    }
  ],
  'TableName': 'MobAppDevice',
  'KeySchema': [
    {
      'AttributeName': 'DeviceID',
      'KeyType': 'HASH'
    }
  ],
  'ProvisionedThroughput': {
    'ReadCapacityUnits': 1,
    'WriteCapacityUnits': 1
  }
}, {
  'AttributeDefinitions': [
    {
      'AttributeName': 'ID',
      'AttributeType': 'S'
    }
  ],
  'TableName': 'MobAppEvent',
  'KeySchema': [
    {
      'AttributeName': 'ID',
      'KeyType': 'HASH'
    }
  ],
  'ProvisionedThroughput': {
    'ReadCapacityUnits': 1,
    'WriteCapacityUnits': 1
  }
}];
tables.map(function(table) {
  console.log('Creating table: ', table.TableName);
  dynamodb.createTable(table, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(JSON.stringify(data, null, 2)); // successful response
  });
});
