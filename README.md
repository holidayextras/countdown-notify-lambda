# countdown-notify-lambda
This project will allow push notifications to be sent for our countdown app by querying DynamoDB tables at intervals.

## Usage

To process all events in the database run:

`AWS_ACCESS_KEY_ID=x AWS_SECRET_ACCESS_KEY=x npm start`

Depending on the access keys used the development, staging or production databases will be queried.

## Deployment

Deployment is all handled by CI, merges to the `staging` branch will deploy to staging, and merges to `master`
will deploy to production.

CI will need the following environment variables setup:

* `STAGING_AWS_ACCESS_KEY_ID`
* `STAGING_AWS_SECRET_ACCESS_KEY`
* `STAGING_AWS_ACCOUNT`
* `PRODUCTION_AWS_ACCESS_KEY_ID`
* `PRODUCTION_AWS_SECRET_ACCESS_KEY`
* `PRODUCTION_AWS_ACCOUNT`