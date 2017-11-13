const mongoose = require('mongoose');
const db = require('../../config').db;

module.exports = (app, debug) => {
  const connStr = `mongodb://${db.username}:${db.password}@${db.host}`;
  mongoose.Promise = global.Promise;
  mongoose.connect(connStr, { useMongoClient: true });

  debug('> configured database.');
};
