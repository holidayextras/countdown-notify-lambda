#!/bin/bash
set -e

echo "Travis branch: ${TRAVIS_BRANCH}";
if [ "${TRAVIS_BRANCH}" = "master" ]; then
  NODE_ENV=production
  AWS_ACCESS_KEY_ID=${PRODUCTION_AWS_ACCESS_KEY_ID}
  AWS_SECRET_ACCESS_KEY=${PRODUCTION_AWS_SECRET_ACCESS_KEY}
else
  NODE_ENV=staging
  AWS_ACCESS_KEY_ID=${STAGING_AWS_ACCESS_KEY_ID}
  AWS_SECRET_ACCESS_KEY=${STAGING_AWS_SECRET_ACCESS_KEY}
fi

echo "Using ${NODE_ENV} settings";

npm run deploy
