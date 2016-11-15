# countdown-notify-lambda
This project will allow push notifications to be sent for our countdown app by querying DynamoDB tables at intervals.

## Usage

To process all events in the database run:

`AWS_ACCESS_KEY_ID=x AWS_SECRET_ACCESS_KEY=x npm start`

Depending on the access keys used the development, staging or production databases will be queried.
