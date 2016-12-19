#!/bin/bash
set -e
if [ ! -d "dynamo_local" ]; then
  mkdir dynamo_local
  cd dynamo_local
  curl -L -o dynamodb_local_latest.tar.gz http://dynamodb-local.s3-website-us-west-2.amazonaws.com/dynamodb_local_latest.tar.gz
  gzip -dc dynamodb_local_latest.tar.gz | tar -xf -
else
  cd dynamo_local
fi
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -inMemory -port 8001