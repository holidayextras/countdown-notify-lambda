# countdown-notify-lambda
This project will allow push notifications to be sent for our countdown app by querying DynamoDB tables at intervals.

## Usage

### Development

To set the correct environment variables to point to the development database etc:

    GCM_SERVER_API_KEY=x AWS_ACCESS_KEY_ID=x AWS_SECRET_ACCESS_KEY=x npm run build

To process all events in the database run:

    npm start

Depending on the access keys used the development, staging or production databases will be queried.

### on AWS Lambda

To run an existing function on one of the AWS environments use the following command:

    AWS_ACCESS_KEY_ID=x AWS_SECRET_ACCESS_KEY=x AWS_ACCOUNT=x npm run build && node script/run_lambda.js

## Deployment

Deployment is all handled by CI, merges to the `staging` branch will deploy to staging, and merges to `master`
will deploy to production.

CI will need the following environment variables setup:

* `STAGING_AWS_ACCESS_KEY_ID`
* `STAGING_AWS_SECRET_ACCESS_KEY`
* `STAGING_AWS_ACCOUNT`
* `STAGING_GCM_SERVER_API_KEY`
* `PRODUCTION_AWS_ACCESS_KEY_ID`
* `PRODUCTION_AWS_SECRET_ACCESS_KEY`
* `PRODUCTION_AWS_ACCOUNT`
* `PRODUCTION_GCM_SERVER_API_KEY`
