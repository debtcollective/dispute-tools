# debt-collective

![LOGO](images/TDC-large.png)

# About

Corporate elites control our government and by extension our lives. They cheat workers, don’t pay their taxes, and then force us into debt for the basic necessities of life: shelter, food, education, and healthcare. We have the power to change this.

![TDC-square](/uploads/205015d23aed82f2193fafa86918202e/TDC-square.png)

* [Design References](Design References)
  * [Moqups][739f0a5a]
  * [Zeplin](https://app.zeplin.io/project.html#pid=57a51eb97faa3bfe33da9e9b&dashboard)

  [739f0a5a]: https://app.moqups.com/Cuiki/y1yKqXcYKp/edit/page/a90714ca5 "moqups"

* [Product Requirements](Product Requirements)
  * [MVP (2016-09-06) current](https://github.com/Empathia/debtcollective/wiki/Product-Requirements-::-2016-09-06)

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
cp knexfile.sample.js knexfile.js
```

### config.js 

* `disableActivation`: when truthy, will not require activation before logging in. Good for testing.


Build the application assets before starting.

```sh
npm run build
```

Run the server

```sh
npm start
```

## Requirements


Run redis with `redis-server`

Run database migrations with `scripts/utils/knexreset`

Run postgres.app
