# debt-collective

[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/debtcollective/Lobby)

Come visit us in the public Debt Collective gitter room

# About

Corporate elites control our government and by extension our lives. They cheat workers, don’t pay their taxes, and then force us into debt for the basic necessities of life: shelter, food, education, and healthcare. We have the power to change this.

* [Guides](Guides)

* [Documentation](Documentation)
  * [Models](Documentation#models)
  * [Mailers](Documentation#mailers)
  * [Controllers](Documentation#controllers)
  * [Libraries](Documentation#libraries)
  * [Views](Documentation#views)
  * [UI](Documentation#ui)

# Dependencies

You will need to install the following libraries/packages in order for
the app to work correctly

* Node 8.9.1
* Redis
* Postgresql
* GraphicsMagick (`brew install graphicsmagick` if you are on macOS)
* ImageMagick (`brew install imagemagick` if you are on macOS)

# Installation

1. Copy config files and edit them as needed
```sh
cp config/config.sample.js config/config.js
cp config/knexfile.sample.js knexfile.js
```
2. Run migrations `yarn db:migrate`
3. Run seeds `yarn db:seed`
4. Build assets `yarn build`
5. Run app `yarn start`

## config.js parameters

* `disableActivation`: when truthy, will not require activation before logging in. Good for testing.

## Emails in Development

We are using [mailcatcher](https://mailcatcher.me/) to visualize emails
in development, to install:

* `gem install mailcatcher`
* Run `mailcatcher`
* Send mail through `smtp://localhost:1025` (If you copied
  `config.sample.js` this is already configured for you
* Go to `http://localhost:1080/` to see emails

# Database Tasks

We are using [Knex](https://github.com/tgriesser/knex) to handle our
migrations. Check their documentation in order to see how to create
migrations and seed files.

## Seeds

To generate seeds you can run `yarn run knex seeds:make <seed_name>`.
Since some seeds need to be executed in order (Collectives before
Campaings for example), we are prepending timestamp to the seeds name. To
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

# How Tos

## Create an admin user

Create an User and change the role to `Admin` in the `Users` table.
