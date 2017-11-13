const session = require('express-session');
const secret = require('../../config').session.secret;

module.exports = (app, debug) => {
  app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false
  }));
};
