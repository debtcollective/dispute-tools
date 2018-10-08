const _ = require('lodash');

const disputeForms = {
  // if there are keys in `_forms`, it contains the most recently saved data
  getData: disputeData => _.merge({}, disputeData.forms || {}, disputeData._forms || {}),
  hasDraft: (disputeData, formName) => Boolean(disputeData._forms && disputeData._forms[formName]),
  hasValidData: (disputeData, formName) =>
    Boolean(disputeData.forms && disputeData.forms[formName]),
};

module.exports = disputeForms;
