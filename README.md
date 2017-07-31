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

# Installation

Create `config.js` and `knexfile.js`, edit them as needed.

```sh
cp config/config.sample.js config/config.js
cp config/knexfile.sample.js knexfile.js
```

* `disableActivation`: when truthy, will not require activation before logging in. Good for testing.

Run redis with `redis-server`

Run postgres.app

Run migrations with `npm run db:migrate`

Build the application assets before starting.

```sh
npm run build
```

Run the server

```sh
npm start
```

## Emails in Development

We are using [mailcatcher](https://mailcatcher.me/) to visualize emails
in development, to install:

* `gem install mailcatcher`
* Run `mailcatcher`
* Send mail through `smtp://localhost:1025` (If you copied
  `config.sample.js` this is already configured for you
* Go to `http://localhost:1080/`

# Requirements

Run redis with `redis-server`

Run database migrations with `scripts/utils/knexreset`

Run postgres.app

# Deployment

Infrastructure setup is handled by [debtcollective-terrraform](https://gitlab.com/debtcollective/debtcollective-terraform). Once you have you environment running, you can deploying using:

1. `pm2 deploy ecosystem.json <environment> setup`
2. `pm2 deploy ecosystem.json <environment>`

For example to deploy to production run

1. `pm2 deploy ecosystem.json production setup`
2. `pm2 deploy ecosystem.json production`

If you need to change branches, servers etc, feel free to edit
`ecosystem.json`

## Configuration Variables

This part is handled by [debtcollective-terrraform](https://gitlab.com/debtcollective/debtcollective-terraform) too, since we are using files for configuration.

# How Tos

## Create an admin user

Create an User and change the role to `Admin` in the `Users` table.
