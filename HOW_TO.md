# How Tos

## Create an admin user

Make sure to add a user admin to your Discourse instance by using:

```
RAILS_ENV=development bundle exec rake admin:create
```

> _If you need extra help with the Discourse installation go to the [FAQ](./FAQ.md)_.

Then, once you are logged into Discourse with your admin user add a custom group to this user. Go to User > Admin, under "groups" type "dispute_pro" and hit ENTER.

## Create a new dispute tool template

Please refer to `services/renderers/README.md` for a description of our rendering pipeline and also guidelines on creating new templates.

## Create/update a new form definition

Please refer to `lib/data/dispute-tools/README.md` for specific documentation about how the forms work.

## Create a new email/discourse message template

Please refer to `views/emails/README.md` for specific information for which template type to make.

The doc-comments on the `Email` and `DiscourseMessage` classes are essential reading for understanding how best to build new emails and discourse messages.

# Emails in Development

We are using [mailcatcher](https://mailcatcher.me/) to visualize emails
in development, to install:

-   `gem install mailcatcher`
-   Run `mailcatcher`
-   Send mail through `smtp://localhost:1025` (If you copied `config.sample.js` this is already configured for you)
-   Go to `http://localhost:1080/` to see emails

# S3 in Development

We are faking S3 with [Minio](https://github.com/minio/minio), so we don't need either a bucket nor an internet connection.

Install it with `brew install minio/stable/minio`.

Run it with

```bash
export MINIO_ACCESS_KEY=access_key
export MINIO_SECRET_KEY=secret_key
minio server ~/.minio
```

## Create buckets

Now you need to create the bucket we are going to use. Go to `http://127.0.0.1:9000`, use the credentials you provided above and create a bucket as described in config.js (`dispute-tools-development` is the default).

# Database Tasks

We are using [Knex](https://github.com/tgriesser/knex) to handle our
migrations. Check their documentation in order to see how to create
migrations and seed files.

## Seeds

To generate seeds you can run `yarn run knex seeds:make <seed_name>`.
Since some seeds need to be executed in order (Collectives before
Campaigns for example), we are prepending timestamp to the seeds name. To
generate a timestamp the same way Knex does for migrations, we are using
the [same code from the Knex repo](https://github.com/tgriesser/knex/blob/f66b524af71adf434cddc1830fd9b369d2f48a32/src/migrate/index.js#L411-L426)

Just copy that code and run it in the Node terminal or a browser console

# App Tasks

We have some tasks to do some manual process in the app, here are some
of them (Feel free to document the others)

## regenerate_dispute_zip_file

This task will try to regenerate the zip file of a Dispute, this can
fail for a number of reason ranging from missing attachments to server
being out of memory, the cool thing is that you can see the output of
the error for easier debugging. You execute this task with the following
command

`./scripts/tasks/regenerate_dispute_zip_file <dispute_id>`

# Deployment

Infrastructure setup is handled by [debtcollective-terrraform](https://gitlab.com/debtcollective/debtcollective-terraform). Once you have you environment running, you can deploy it using Docker.

## Configuration Variables

`config.js` is the file that holds all the configuration, you can edit
this file with values in development, but for production and staging we
are using environment variables. This part is handled by [debtcollective-terrraform](https://gitlab.com/debtcollective/debtcollective-terraform).

# Design

We use `pug` and `vuejs` for the templates.
`pug` files are located in `views`
For styling, we use `basscss`.
Layout and typography are declared inside the templates (e.g. using `basscss` layout utilities like `pb3`).
CSS is used for for specific stylings or shortcuts for obvious stuff.

# Development Guide

## Error handling

We'll want to report errors using [Sentry](https://docs.sentry.io/clients/node/). This helps us keep track of recurring errors. Sentry also wraps our application in a context that allows it to trace the failure in better ways than a standard stack trace.

```javascript
const { Sentry, logger } = require('/lib');

try {
    // something that fails
} catch (e) {
    Sentry.captureException(e);
    logger.error('Error occurred while trying to do something important', JSON.stringify(e));
}
```

## Use Docker for development

The easiest way to get started running the dispute-tools locally is through [Docker](https://www.docker.com/).

1.  Build the image

```bash
docker build -t tdc-dispute-tools .
```

2.  Copy the env-file

```bash
cp config/config.env.env config/config.local.env
```

3.  Edit the env-file as needed.

    Some convenient defaults are provided, but the follow _must_ be provided

    -   AWS credentials for uploading generated dispute documents
    -   Discourse host sso endpoint
    -   SSO secret shared between the dispute tools service and Discourse for securing SSO

4.  Run the container

```bash
docker run -idt --env-file ./config/config.local.env --name tdc-dispute-tools -p 8080:8080 tdc-dispute-tools:latest
```

5.  Navigate to localhost:8080 in your browser and you should see the home page!
