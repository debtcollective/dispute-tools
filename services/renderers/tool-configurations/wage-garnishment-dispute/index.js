const wageGarnishment = require('./wage-garnishment-dispute');
const { configure } = require('../shared/federal-student-loan-disputes');

module.exports = configure('11111111-1111-1111-1111-111111111111', wageGarnishment);
