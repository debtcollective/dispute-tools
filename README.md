# The Debt Collective - Dispute Tools

Corporate elites control our government and by extension our lives. They cheat workers, don’t pay their taxes, and then force us into debt for the basic necessities of life: shelter, food, education, and healthcare. We have the power to change this.

# Getting Started

The easiest way to get started running the dispute-tools locally is through [Docker](https://www.docker.com/).

1. Build the image

```bash
docker build -t tdc-dispute-tools .
```

2. Copy the env-file

```bash
cp config/config.env.env config/config.local.env
```

3. Edit the env-file as needed.

    Some convenient defaults are provided, but the follow _must_ be provided

    * AWS credentials for uploading generated dispute documents
    * Discourse host sso endpoint
    * SSO secret shared between the dispute tools service and Discourse for securing SSO

4. Run the container

```bash
docker run -idt --env-file ./config/config.local.env --name tdc-dispute-tools -p 8080:8080 tdc-dispute-tools:latest
```

5. Navigate to localhost:8080 in your browser and you should see the home page!

# Dependencies

You will need to install the following libraries/packages in order for
the app to work correctly

* [Node](https://nodejs.org/) 8.9.1
* [PostgreSQL](https://www.postgresql.org/) 9.5 or greater
* [Discourse](https://github.com/discourse/discourse) is our community hub and SSO provider (the latter of which is critical for the dispute tools)
* PDFtk (user this [Installer](`https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/pdftk_server-2.02-mac_osx-10.11-setup.pkg`) if you are on macOS)
* [Yarn](https://yarnpkg.com/) 1.3 or greater

## Optional Dependencies

You may need to install the following for certain parts of the app to work correctly

* GhostScript

# Installation

1. Clone the repo

```bash
git clone git@gitlab.com:debtcollective/debtcollective.git
cd debtcollective
```

2. Copy config files and edit them as needed

```bash
cp config/config.sample.js config/config.js
cp config/knexfile.sample.js knexfile.js
```

3. (optional, recommended) Disable account activation
   Update `./debtcollective/config/config.js` to include `disableActivation` attribute

# Run server

Ensure Postgres is running.

1. Run migrations `yarn db:migrate`
2. Run seeds `yarn db:seed`
3. Install dependencies `yarn`
4. Build assets `yarn build`
5. Run app `yarn start`

# Emails in Development

We are using [mailcatcher](https://mailcatcher.me/) to visualize emails
in development, to install:

* `gem install mailcatcher`
* Run `mailcatcher`
* Send mail through `smtp://localhost:1025` (If you copied `config.sample.js` this is already configured for you)
* Go to `http://localhost:1080/` to see emails

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

Infrastructure setup is handled by [debtcollective-terrraform](https://gitlab.com/debtcollective/debtcollective-terraform). Once you have you environment running, you can deploying using:

1. `pm2 deploy ecosystem.json <environment> setup`
2. `pm2 deploy ecosystem.json <environment>`

For example to deploy to production run

1. `pm2 deploy ecosystem.json production setup`
2. `pm2 deploy ecosystem.json production`

If you need to change branches, servers etc, feel free to edit `ecosystem.json`

## Configuration Variables

This part is handled by [debtcollective-terrraform](https://gitlab.com/debtcollective/debtcollective-terraform) too, since we are using files for configuration.

# Design

We use `pug` and `vuejs` for the templates.
`pug` files are located in `views`
For styling, we use `basscss`.
Layout and typography are declared inside the templates (e.g. using `basscss` layout utilities like `pb3`).
CSS is used for for specific stylings or shortcuts for obvious stuff.

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
