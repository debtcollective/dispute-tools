/* globals Class, Krypton */
const _ = require('lodash');

const RESTfulAPI = Class({}, 'RESTfulAPI')({
  COMPARISON_OPERATORS: {
    $eq: '=',
    $ne: '<>',
    $lt: '<',
    $lte: '<=',
    $gt: '>',
    $gte: '>=',
    $in: 'IN',
    $nin: 'NOT IN',
    $like: 'LIKE',
    $ilike: 'ILIKE',
  },

  CLAUSES: {
    $and: 'where',
    $or: 'orWhere',
  },

  createMiddleware(config) {
    return ((req, res, next) => {
      config.req = req;
      config.res = res;

      const restApi = new RESTfulAPI(config);

      restApi.build()
        .then((results) => {
          res.locals.results = results;
          return next();
        })
        .catch(next);
    });
  },

  prototype: {
    req: null,
    res: null,
    queryBuilder: null,
    order: null,
    paginate: null,
    filters: null,

    init(config) {
      this.paginate = {
        pageSize: 50,
      };

      this.filters = {
        allowedFields: [],
      };

      this.order = {
        default: '-created_at',
        allowedFields: ['created_at'],
      };

      Object.assign(this, config);

      if (!this.req) {
        throw new Error('Must provide a req: <RequestObject>');
      }

      if (!this.res) {
        throw new Error('Must provide a res: <ResponseObject>');
      }

      if (!this.paginate.pageSize) {
        throw new Error('Must provide a pageSize for pagination {pageSize : 50 }');
      }

      if (!Array.isArray(this.filters.allowedFields)) {
        throw new Error('filters.allowedFields must be an Array');
      }

      if (!this.order.default) {
        throw new Error('Must provide a order.default field');
      }

      if (!Array.isArray(this.order.allowedFields)) {
        throw new Error('order.allowedFields must be an Array');
      }

      if (!(this.queryBuilder instanceof Krypton.QueryBuilder)) {
        throw new Error('queryBuilder is not an instance of QueryBuilder');
      }

      return this;
    },

    _buildOrder() {
      const order = this.req.query.order || this.order.default;

      let sortOrder;
      let field;

      if (order.indexOf('-') === 0) {
        sortOrder = 'DESC';
        field = order.substr(1, order.length - 1);
      } else {
        sortOrder = 'ASC';
        field = order;
      }

      if (this.order.allowedFields.includes(field)) {
        this.queryBuilder.orderBy(field, sortOrder);
      }

      return this;
    },

    _buildFilters() {
      this._filtersToQueryBuilder(this.req.query.filters || {});

      return this;
    },

    _filtersToQueryBuilder(filters, parentKey) {
      const restApi = this;

      Object.keys(filters).forEach((key) => {
        const value = filters[key];

        let methodName = restApi.constructor.CLAUSES[key];

        if (methodName) {
          // key === '$and' || '$or'
          return restApi._filtersToQueryBuilder(value, key);
        }

        if (_.isPlainObject(value)) {
          // key === '{field_name}'
          return restApi._filtersToQueryBuilder(value, key);
        }

        let column;
        let operator;

        if (parentKey) {
          if (restApi.constructor.COMPARISON_OPERATORS[key]) {
            operator = restApi.constructor.COMPARISON_OPERATORS[key];
            column = parentKey;
          } else {
            methodName = restApi.constructor.CLAUSES[parentKey];
            column = key;
          }
        }

        column = column || key;
        operator = operator || '=';
        methodName = methodName || 'where';

        if (restApi.filters.allowedFields.includes(column)) {
          return restApi.queryBuilder[methodName](column, operator, value);
        }

        return false;
      });
    },

    _buildPagination() {
      const restApi = this;
      let eagerExpression;
      const currentPage = Math.abs(parseInt(restApi.req.query.page, 10) || 1);

      // Remove the orderBy clause since can't count with an order clause;
      let orderIndex;

      restApi.queryBuilder._queryMethodCalls.forEach((item) => {
        if (item.method === 'orderBy') {
          orderIndex = restApi.queryBuilder._queryMethodCalls.indexOf(item);
        }
      });

      const orderClause = restApi.queryBuilder._queryMethodCalls.splice(orderIndex, 1)[0];

      if (restApi.queryBuilder._eagerExpression) {
        eagerExpression = restApi.queryBuilder._eagerExpression;
        restApi.queryBuilder._eagerExpression = null;
      }

      return restApi.queryBuilder.count('*')
        .then((result) => {
          const total = result[0].count;
          const pages = Math.round(total / restApi.paginate.pageSize);

          restApi.res.set('total_count', total);
          restApi.res.set('total_pages', pages);

          // Remove count call from previous query.
          let countIndex;
          restApi.queryBuilder._queryMethodCalls.forEach((item) => {
            if (item.method === 'count') {
              countIndex = restApi.queryBuilder._queryMethodCalls.indexOf(item);
            }
          });

          restApi.queryBuilder
            ._queryMethodCalls.splice(countIndex, 1);

          // Put back the orderBy clause if exists
          if (orderClause) {
            restApi.queryBuilder._queryMethodCalls.push(orderClause);
          }

          // Put back the eager expression
          if (eagerExpression) {
            restApi.queryBuilder._eagerExpression = eagerExpression;
          }


          return restApi.queryBuilder.page(currentPage, restApi.paginate.pageSize);
        });
    },

    build() {
      this._buildOrder()
        ._buildFilters();

      return this._buildPagination().then((queryBuilder) => {
        return queryBuilder;
      });
    },
  },
});

module.exports = RESTfulAPI;
