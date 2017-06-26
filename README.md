# debt-collective

![LOGO](images/TDC-large.png)

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

Run migrations:
```
npm run db:migrate
```


Build the application assets before starting.

```sh
npm run build
```

Run the server

```sh
npm start
```

