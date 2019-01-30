# The Debt Collective - Dispute Tools

Corporate elites control our government and by extension our lives. They cheat workers, don’t pay their taxes, and then force us into debt for the basic necessities of life: shelter, food, education, and healthcare. We have the power to change this.

# Dependencies

You will need to install the following libraries/packages in order for
the app to work correctly

-   [Node](https://nodejs.org/) 8.11.4 _(version 10.x.x is [incompatible](http://pdfhummus.com/post/173608369726/hummusjs-1087) with `hummus`)_
-   [PostgreSQL](https://www.postgresql.org/) 10.x
-   [Discourse](https://github.com/discourse/discourse) is our community hub and SSO provider (the latter of which is critical for the dispute tools)
-   PDFtk (use this [Installer](https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/pdftk_server-2.02-mac_osx-10.11-setup.pkg))
-   [Redis](https://redis.io/) 4.x
-   [Yarn](https://yarnpkg.com/)
-   [GhostScript](https://www.ghostscript.com/) (`brew install ghostscript`)

# Disclaimer

This document is intended to describe in some way the happy path to have everything set after having the Discourse installation ready, if you have any issues please check our [FAQ](./FAQ.md) for a faster onboarding. Go to [GETTING_STARTED](./GETTING_STARTED.md) in order to setup your Discourse instance properly.

# Installation

1.  Clone this repository
2.  Copy config files and edit them as needed by first running the `make config` command.

In particular, you may need to edit `discourse.apiKey`.

## Configuration file

In order to add the right value to `discourse.apiKey`, you need to run your Discourse instance and then:

1.  Login with Admin user
1.  Go to [http://localhost:3000/admin/api/keys](http://localhost:3000/admin/api/keys) and create a new API key
1.  Add the new API key to the `discourse.apiKey` within config file

## Enable SSO

You need to make sure your Discourse installation have the following settings propely set otherwise the CRUD of Disputes won't work as expected:

- Enable sso ☑️
- sso allows all return paths ️️☑️
- enable sso provider ☑️
- sso url _http://localhost:8080_
_ sso secret _sso\_secret_
_ sso provider secrets _create a new entry pair with: * and sso\_secret values_

Make sure you can access to _"My Disputes"_ once you build and run this project.

# Run server

Ensure Postgres is running (e.g., with `ps aux | grep postgres`). And run:

```
make project
```

If there is any issue with the command try running separately and review the [FAQ](./FAQ.md) file.

1.  Install dependencies `yarn`
1.  Set up the database `yarn utils:resetdb`
1.  Run migrations `yarn db:migrate`
1.  Run seeds `yarn db:seed`
1.  Build assets `yarn build`

Once you have run the above commands successfully *start the server* using `yarn start`

> _You can spin up the discourse server (the [best
> instructions](https://github.com/discourse/discourse/blob/master/docs/DEVELOPER-ADVANCED.md))._

At this point if you have reviewed the [GETTING_STARTED](./GETTING_STARTED.md) guide and [added the admin user](./HOW_TO.md) you should be able to run Discourse alongside this project and see both apps running properly and with a synced header _(once you log into Discourse the Dispute tools app will update its header)_.

## S3 uploads in development

We use [Minio](https://github.com/minio/minio) as our S3 compatible object storage for dev environments. Follow the installation instructions in their repo.

```sh
mkdir -p ~/.minio/dispute-tools-development
minio server ~/.minio
```

We use the default Minio configuration.

## Powered by

[<img src="https://www.browserstack.com/images/layout/browserstack-logo-600x315.png" alt="BrowserStack" width="219"/>](http://browserstack.com/)
