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

You need to make sure your Discourse installation have the following settings propely set otherwise you won't be able to login in this app. You can set these values in the Discourse admin (http://localhost:3000/admin/site_settings/category/all_results?filter=sso)

-   sso allows all return paths: ✅
-   enable sso provider: ✅
-   verbose sso logging: ✅
-   sso provider secrets:
-   create a new item and set:
    -   url: \*
    -   SSO secret: sso_secret (**sso_secret** is the default value in `config.sample.js`)

Make sure you can access to _"My Disputes"_ once you build and run this project.

> NOTICE: "enable sso" and "sso url" should be unmarked and empty respectively

## Enable CORS

On top of the need to run the Discourse server with

```bash
env DISCOURSE_ENABLE_CORS=true rails s
```

Make sure to go to Discourse admin (http://localhost:3000/admin/site_settings/category/all_results?filter=cors) and add a "cors origins" item:

```
http://localhost:8080
```

> If you access the app using 127.0.0.1 instead, just make sure to check the console and copy/paste the CORS rejected URL that is on the error message.

# Run server

Ensure Postgres is running (e.g., with `ps aux | grep postgres`). And run:

```
make config-files
make setup
```

If there is any issue with the command try running separately and review the [FAQ](./FAQ.md) file.

1.  Install dependencies `yarn`
1.  Set up the database `yarn utils:resetdb`
1.  Run migrations `yarn db:migrate`
1.  Run seeds `yarn db:seed`
1.  Build assets `yarn build`

Once you have run the above commands successfully _start the server_ using `yarn start`

> _You can spin up the discourse server (the [best
> instructions](https://github.com/discourse/discourse/blob/master/docs/DEVELOPER-ADVANCED.md))._

At this point if you have reviewed the [GETTING_STARTED](./GETTING_STARTED.md) guide and [added the admin user](./HOW_TO.md) you should be able to run Discourse alongside this project and see both apps running properly and with a synced header _(once you log into Discourse the Dispute tools app will update its header)_.

## Development

Once you've run the server, in order to being able to enable hot-reload you should open a new terminal tab _(while `yarn start` is running in parallel)_ and run

```
yarn watch
```

Once both task are running together you will be able to make changes and see the updaded code in the browser.

> Tip: if your lint remove any `debugger;` word from the codebase due to our project rules you can use `//eslint-disable-next-line` in order to being able to set a break point with `debugger;` keyword.

## S3 uploads in development

We use [Minio](https://github.com/minio/minio) as our S3 compatible object storage for dev environments. Follow the installation instructions in their repo.

```sh
mkdir -p ~/.minio/dispute-tools-development
minio server ~/.minio
```

We use the default Minio configuration.

# Powered by

[<img src="https://www.browserstack.com/images/layout/browserstack-logo-600x315.png" alt="BrowserStack" width="219"/>](http://browserstack.com/)
