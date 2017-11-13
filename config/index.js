const debug = require('debug')('mobilevote:config');

const modules = [
  require('./modules/database'),
  require('./modules/session'),
  require('./modules/authentication'),
  require('./modules/middleware'),
  require('./modules/routes')
];

exports.configure = (app) => {
  debug('Configuring modules.');
  modules.forEach((config) => config(app, debug));
  debug('Modules configured.');
};
