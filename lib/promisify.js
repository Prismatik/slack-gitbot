var _ = require("lodash");

module.exports = function(obj, methods) {
  var api = {};

  _.each(methods, method => {
    _.each(obj[method], (prop, key) => {
      if (!_.isFunction(prop)) return;
      if (!api[method]) api[method] = {};

      api[method][key] = (args) => new Promise((resolve, reject) => {
        prop.apply(obj, [args, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }]);
      });
    });
  });

  return api;
}
