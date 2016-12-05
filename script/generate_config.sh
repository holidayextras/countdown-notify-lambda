#!/bin/bash
set -e
# generate the dynamic config using current env vars.

NODE_ENV=${NODE_ENV:=development}

echo "NODE_ENV=${NODE_ENV}"
echo "AWS_ENVIRONMENT=${NODE_ENV}"

echo "GCM_SERVER_API_KEY=${GCM_SERVER_API_KEY}"

if [ "${NODE_ENV}" = "production" ]; then
  echo "APN_GATEWAY=gateway.push.apple.com"
else
  echo "APN_GATEWAY=gateway.sandbox.push.apple.com"
fi

echo "AWS_ROLE_ARN=arn:aws:iam::${AWS_ACCOUNT}:role/CountdownNotify-${NODE_ENV}"


echo "SUMOLOGIC_URL=${SUMOLOGIC_URL}"
echo "SUMOLOGIC_CODE=${SUMOLOGIC_CODE}"

echo "FORCED_AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}"
echo "FORCED_AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}"
