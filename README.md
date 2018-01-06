# The Debt Collective
[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/debtcollective/Lobby)  

Corporate elites control our government and by extension our lives. They cheat workers, don’t pay their taxes, and then force us into debt for the basic necessities of life: shelter, food, education, and healthcare. We have the power to change this.

# Dependencies

You will need to install the following libraries/packages in order for
the app to work correctly

* [Node](https://nodejs.org/) 8.9.1
* [Redis Server](https://redis.io/) 4.0 or greater
* [PostgreSQL](https://www.postgresql.org/) 9.5 or greater
* GraphicsMagick (`brew install graphicsmagick` if you are on macOS)
* ImageMagick (`brew install imagemagick` if you are on macOS)
* PDFtk (`brew cask install pdftk` if you are on macOS)
4. [Yarn](https://yarnpkg.com/) 1.3 or greater

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
```javascript
development: {
  disableActivation: true,
  ...
}
```

# Run server

Ensure Redis and Postgres are running.

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

# How Tos

## Create an admin user

Create an User and change the role to `Admin` in the `Users` table.

## Create a new dispute tool template

Please refer to `services/renderers/README.md` for a description of our rendering pipeline and also guidelines on creating new templates.

## Workers

We are using [bee-queue](https://github.com/bee-queue/bee-queue) as our
background jobs processing library. This will run as a separated app
along with the application. The idea with this is to take out time
consuming processes from the request/response and move them here. Things
like emails, dispute renderers or any other process that can be done in
the background should be done here.

### Create a worker

To create a worker follow, first add a new file in the `workers` directory. This file should expose a function with this interface

```js
function worker(job <Bee-queue Object>, done <Callback) {}
```

`job` is an object that has information about the job, but it has all
the parameters in the `job.data` key.

Then add this function to the `workers/worker.js` file, follow the same
structure there, binding all the events and creating a queue.

The naming convention we are using for workers and queues is the
following one:

* worker = `<workerName>Worker`
* queue = `<workerName>`

### Enqueue a job

You enqueue a job like this

```js
// Define the Queue
const createQueue = require('./workers/utils').createQueue;
const userLocationQueue = createQueue('userLocation');


// Enqueue a Job
userLocationQueue
  .createJob({
    accountId: account.id,
  })
  .save();
```
