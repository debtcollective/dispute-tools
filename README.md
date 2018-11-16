[![codecov](https://codecov.io/gh/debtcollective/dispute-tools/branch/master/graph/badge.svg)](https://codecov.io/gh/debtcollective/dispute-tools)

# The Debt Collective - Dispute Tools

Corporate elites control our government and by extension our lives. They cheat workers, don’t pay their taxes, and then force us into debt for the basic necessities of life: shelter, food, education, and healthcare. We have the power to change this.

# Dependencies

You will need to install the following libraries/packages in order for
the app to work correctly

-   [Node](https://nodejs.org/) 8.11.4
    -   version 10.x.x is [incompatible](http://pdfhummus.com/post/173608369726/hummusjs-1087) with `hummus`
-   [PostgreSQL](https://www.postgresql.org/) 10.x
-   [Discourse](https://github.com/discourse/discourse) is our community hub and SSO provider (the latter of which is critical for the dispute tools)
-   PDFtk (use this [Installer](https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/pdftk_server-2.02-mac_osx-10.11-setup.pkg))
-   [Redis](https://redis.io/) 4.x
-   [Yarn](https://yarnpkg.com/)
-   [GhostScript](https://www.ghostscript.com/) (`brew install ghostscript`)

# Installation

1.  Clone the repo

```bash
git clone git@gitlab.com:debtcollective/debtcollective.git
cd debtcollective
```

2.  Copy config files and edit them as needed

```bash
cp config/config.sample.js config/config.js
cp config/knexfile.sample.js knexfile.js
```

In particular, you may need to edit `aws.bucket`, `aws.secrets`, and `discourse.apiKey`.

# Run server

Ensure Postgres is running (e.g., with `ps aux | grep postgres`).
Also, spin up the discourse server (the [best
instructions](https://github.com/discourse/discourse/blob/master/docs/DEVELOPER-ADVANCED.md)).

1.  Install dependencies `yarn`
1.  Set up the database `yarn utils:resetdb`
1.  Run migrations `yarn db:migrate`
1.  Run seeds `yarn db:seed`
1.  Build assets `yarn build`
1.  Run app `yarn start`

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

We'll want to report errors into Sentry using [Raven](https://docs.sentry.io/clients/node/). This helps us keep track of recurring errors. Raven also wraps our application in a Raven context that allows it to trace the failure in better ways than a standard stack trace.

```javascript
const { Raven, logger } = require('/lib');

try {
    // something that fails
} catch (e) {
    Raven.captureException(e);
    logger.error('Error occurred while trying to do something important', JSON.stringify(e));
}
```

# How Tos

## Create an admin user

Create an User and change the role to `Admin` in the `Users` table.

## Create a new dispute tool template

Please refer to `services/renderers/README.md` for a description of our rendering pipeline and also guidelines on creating new templates.

## Create/update a new form definition

Please refer to `lib/data/dispute-tools/README.md` for specific documentation about how the forms work.

## Create a new email/discourse message template

Please refer to `views/emails/README.md` for specific information for which template type to make.

The doc-comments on the `Email` and `DiscourseMessage` classes are essential reading for understanding how best to build new emails and discourse messages.

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

## Discourse

### Enable CORS

Go to the Discourse admin settings and search for _cors_, you need to:

-   Set **cors origins** to http://localhost:8080, and any other URL you
    that needs to login with Discourse

You also need to run Discourse with the env variable `DISCOURSE_ENABLE_CORS=true`

```bash
env DISCOURSE_ENABLE_CORS=true rails s
```

### Enable Discourse as SSO provider

Go to the Discourse admin settings and search for _sso_, you need to:

-   Set **sso secret** to the same value you have in the config.js
-   Enable **enable sso provider**
-   Enable **sso allows all return paths**
-   Enable **enable sso provider**

### Use production Discourse configuration

We have the configuration that is used by production and staging in
Terraform, you can take a look at the `discourse` module in the repo and
take the configuration file from there. With this file you can apply the
same settings we use in prod locally.

Inside the Discourse directory run

```bash
rails site_settings:import < settings.yml
```

To export settings to update the Terraform repo use

```bash
rails site_settings:export > settings.yml
```

## BrowserStack

[<img src="https://www.browserstack.com/images/layout/browserstack-logo-600x315.png" alt="BrowserStack" width="219"/>](http://browserstack.com/)

We use [BrowserStack](http://browserstack.com/) to test this application in multiple browsers and devices
