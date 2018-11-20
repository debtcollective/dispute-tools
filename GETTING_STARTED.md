# Getting Started

In order to start the development go ahead and check the discourse repository at: 

[discourse/discourse](https://github.com/discourse/discourse)

## Database setup

*In case the needed ruby version is not avaiable you need to install it and make sure it is within your ruby-build, you may use `brew update && brew upgrade ruby-build`*

It is suggested to create the database using a preffix for the specific project, you can choose between run commands with explicit env variables like so:

    *DISCOURSE_DEV_DB=debtcollective_discourse_development bundle exec rake db:create db:migrate*


**OR an EASIER WAY** to avoid to write the environment value on every command is to directly update the `config/database.yml` file on your discourse instance to use `debtcollective_discourse_development` instead `discourse_development`

If you choose to use the env variable, in order to properly run the server afterwards you will run: 

    *DISCOURSE_DEV_DB=debtcollective_discourse_development bundle exec rails s*

Once you have installed Discourse locally by pulling the repo and creating the database you will be able to run:

    bundle exec rails server

If everything goes as expected you should see at: [http://localhost:3000/](http://localhost:3000/)

[](https://www.notion.so/fcd4899b4c784a799d55c6856140ddf2#a6921d6d9a2241ff8ef8739e84ae1026)

*fig 1. Welcome message*

## Adding custom plugins

At this point you may want to be in a new branch on your Discourse instance folder project as we can potentially change/update code that is specfic for the project. Once you are in a new branch and in the **discourse root folder** run:

    cd plugins

and then run:

    git clone https://github.com/discourse/docker_manager.git &&
    git clone https://github.com/discourse/discourse-assign.git &&
    git clone https://github.com/discourse/discourse-staff-notes.git &&
    git clone https://github.com/angusmcleod/discourse-events.git &&
    git clone https://github.com/angusmcleod/discourse-locations.git &&
    git clone https://github.com/angusmcleod/discourse-custom-wizard.git &&
    git clone https://github.com/debtcollective/discourse-debtcollective-theme.git &&
    git clone https://github.com/debtcollective/discourse-debtcollective-migratepassword.git &&
    git clone https://github.com/debtcollective/discourse-debtcollective-wizards.git &&
    git clone https://github.com/debtcollective/discourse-utilities.git

The above will clone all the plugins that we use to create the full instance of our community platform, some of those plugins are third parties and other from our team. At this point you should restart the server by performing something like:

    rm -rf tmp; DISCOURSE_DEV_DB=debtcollective_discourse_development bundle exec rails s

The plugins section within admin should display all plugins *(something similar to below)*

[](https://www.notion.so/fcd4899b4c784a799d55c6856140ddf2#9d3c26174b04439b8f004d3904f93ecf)

*fig 2. Admin plugin panel*

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

You should have something like the following images:

[](https://www.notion.so/duranmla/Notes-53069339d4734cbf880a2453f1375ec5#08b6e1a65b5548e5992b045363b599f2)
[](https://www.notion.so/duranmla/Notes-53069339d4734cbf880a2453f1375ec5#63250c1ee3494303af199b8107150686)

### Use production Discourse configuration

We have the configuration that is used by production and staging in
Terraform, in order to import those settings, go inside the Discourse directory and run:

```bash
cd script/import_scripts
git clone https://github.com/debtcollective/discourse-import.git debtcollective
cd -
```

Apply some seeds by:

```bash
bundle exec ruby script/import_scripts/debtcollective/seeds.rb
```

Lastly, we are able to apply the production settings by running:

```bash
curl -s https://raw.githubusercontent.com/debtcollective/ds-terraform/master/modules/compute/services/discourse/settings.yml | rails site_settings:import
```

Now you are ready to contribute to the team.👌 🚀

## Related Links

- [https://meta.discourse.org/t/beginners-guide-to-install-discourse-on-macos-for-development/15772](https://meta.discourse.org/t/beginners-guide-to-install-discourse-on-macos-for-development/15772)
- [https://meta.discourse.org/t/beginners-guide-to-creating-discourse-plugins-part-1/30515](https://meta.discourse.org/t/beginners-guide-to-creating-discourse-plugins-part-1/30515)