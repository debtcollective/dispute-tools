# FAQ

# Installing Dispute Tools

**I.** _Receive error Knex:Error Pool2 - error: role "postgres" does not exist when trying to migrate with yarn db:migrate_. In order to solve this we must run createuser -s postgres listing the roles should have the postgres one like:

[](https://www.notion.so/duranmla/Notes-53069339d4734cbf880a2453f1375ec5#2fcccc92802c40658e070bdc90b636b3)

**II.** _I got an error related to PhantomJS not found on PATH._ Make sure you have homebrew to run brew cask install phantomjs prior to yarn install dependencies in order the process to work as expected.

**III.** _psql: FATAL:  database <User> does not exist_.  Run: `createdb <User> -U <User>` prior to intend to run yarn utils:resetdb.

**IV.** _"discourse\_development" db not found_. You should update the database document directly on the Discourse project under `config/database.yml` file to use `debtcollective_discourse_development` instead `discourse_development` or use the env variable before the rails command `DISCOURSE_DEV_DB=debtcollective_discourse_development`.