const index = require('../../routes/index');
const accounts = require('../../routes/accounts');
const elections = require('../../routes/elections');
const ballots = require('../../routes/ballots');

module.exports = (app, debug) => {
  app.use('/', index);
  app.use('/accounts', accounts);

  app.use('/elections', elections);
  app.use('/ballots', ballots);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  debug('> configured routes.');
};
