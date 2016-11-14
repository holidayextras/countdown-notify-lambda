#!/bin/bash
set -e
# generate the dynamic config using current env vars.

NODE_ENV=${NODE_ENV:=development}

echo "NODE_ENV=${NODE_ENV}"
echo "AWS_ENVIRONMENT=${NODE_ENV}"

echo "GCM_SENDER_ID=${GCM_SENDER_ID}"

if [ "${NODE_ENV}" = "production" ]; then
  echo "APN_GATEWAY=gateway.push.apple.com"
else
  echo "APN_GATEWAY=gateway.sandbox.push.apple.com"
fi

echo "SUMOLOGIC_URL=${SUMOLOGIC_URL}"
echo "SUMOLOGIC_CODE=${SUMOLOGIC_CODE}"


