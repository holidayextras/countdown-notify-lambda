#!/bin/bash
set -e

echo "Travis branch: ${TRAVIS_BRANCH}";
if [ "${TRAVIS_BRANCH}" = "master" ]; then
  export NODE_ENV=production
  export AWS_ACCESS_KEY_ID=${PRODUCTION_AWS_ACCESS_KEY_ID}
  export AWS_SECRET_ACCESS_KEY=${PRODUCTION_AWS_SECRET_ACCESS_KEY}
else
  export NODE_ENV=staging
  export AWS_ACCESS_KEY_ID=${STAGING_AWS_ACCESS_KEY_ID}
  export AWS_SECRET_ACCESS_KEY=${STAGING_AWS_SECRET_ACCESS_KEY}
fi

echo "Using ${NODE_ENV} settings";

npm run deploy
