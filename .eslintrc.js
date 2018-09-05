const npmPackage = require('./package.json');
const resolverMap = Object.keys(npmPackage._moduleAliases).map(function(key) {
  return [key, npmPackage._moduleAliases[key]];
});

module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true,
    browser: true,
  },
  plugins: ['mocha'],
  extends: ['airbnb-base', 'plugin:vue/recommended'],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 8,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'comma-dangle': [2, 'always-multiline'],
    'consistent-return': 0,
    'new-cap': [
      1,
      {
        capIsNewExceptions: ['Class', 'Module', 'Interface', 'RouteMappings', 'Knex', 'Vue'],
      },
    ],
    'mocha/no-exclusive-tests': [0, {}],
    'no-param-reassign': [0, {}],
    'no-underscore-dangle': [0, {}],
    'global-require': [0],
    'arrow-body-style': [1, 'as-needed'],
    'no-global-assign': [0],
    'no-shadow': [
      0,
      {
        allow: ['done', 'err', 'res', 'req', 'resolve', 'reject'],
      },
    ],
    'jsx-uses-vars': 0,
    indent: 0,
    'max-len': [2, { code: 100, ignoreStrings: true, ignoreTemplateLiterals: true }],
  },
  settings: {
    'import/resolver': {
      alias: {
        map: resolverMap,
      },
    },
  },
};
