# debt-collective

![LOGO](images/TDC-large.png)

|   	|   	|
|---	|---	|
|Client  	|The Debt Collective   	|
|Contact   	| [Laura Hanna][243927d5], [Ann Larson][bd3c37c6] |
|Slack Channel   	|[pr-debt-collective][4cc2794a]  	|
|Lead Designer   	|[Fernando Machuca][a21d424e]   	|
|Lead Backend   	|[Sergio de la Garza][62433afc]   	|
|Lead Frontend   	|[Noel Delgado][948ec1b7]   	|
|Next Release   	|[MVP 2016-09-06](Product Requirements - MVP)   	|


  [4cc2794a]: https://empathia.slack.com/messages/pr-debt-collective/ "pr-debt-collective"
  [243927d5]: https://empathia.slack.com/messages/laurahanna/ "Laura Hanna"
  [bd3c37c6]: https://empathia.slack.com/messages/annlarson/ "Ann Larson"
  [a21d424e]: https://empathia.slack.com/messages/@chuca/ "@chuca"
  [62433afc]: https://empathia.slack.com/messages/@sgarza/ "@sgarza"
  [948ec1b7]: https://empathia.slack.com/messages/@noeldelgado/ "@noeldelgado"



# About

The Debt Collective is a non-profit organization based in New York City. Their goal is to have every American provided with all of basic services without paying for them. Currently, they're focused on organizing and helping people in debt to dispute and reject unfair debt in which they are in. Examples of these types of debt are student loans, medical debt, credit card debt, fines and garnishment.

The Debt Collective is a team of organizers, technologists, media, and legal experts that is building a platform to allow members — whether they are low-wage workers, mortgage holding families, or struggling former college students — to re-negotiate, resist, and refuse unfair debts.

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


