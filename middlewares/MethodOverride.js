const methodOverride = require('method-override');

// module.exports = [
//   methodOverride('X-HTTP-Method'),
//   methodOverride('X-HTTP-Method-Override'),
//   methodOverride('X-Method-Override'),
//   methodOverride('_method'),
//   methodOverride(function(req, res) {
//   if (req.body && typeof req.body === 'object' && '_method' in req.body) {
//     // look in urlencoded POST bodies and delete it
//     var method = req.body._method
//     delete req.body._method
//     return method
//   }
// })];

module.exports = methodOverride(req => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    const method = req.body._method;
    delete req.body._method;
    return method;
  }

  return undefined;
});
