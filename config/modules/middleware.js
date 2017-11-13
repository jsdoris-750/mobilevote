function addSessionToResponse(req, res, next) {
  res.locals.user = req.user || null;
  next();
}

function ensureLoggedIn(req, res, next) {
  switch (req.url) {
    case '/':
    case '/accounts/login':
    case '/accounts/register':
      return next();
    default:
      if (req.user) {
        return next();
      }
      return res.redirect('/');
  }
}

module.exports = (app, debug) => {
  app.use(ensureLoggedIn);
  app.use(addSessionToResponse);
  debug('> configured middleware.');
};
