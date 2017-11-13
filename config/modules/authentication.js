const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/user');
const helpers = require('../../lib/helpers');

module.exports = (app, debug) => {
  passport.use('local-register', new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true
    },
    (req, email, password, done) => {
      var err;
      //check pin
      if (!helpers.checkPin(req.body.pin)) {
        err = new Error('Pin is not valid.');
        err.status = 400;
        return done(err);
      }

      User.findOne({ email: email })
        .then((user) => {
          if (user) {
            err = new Error('User exists.');
            err.status = 400;
            return done(err);
          }

          user = new User({
            email: email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
          });

          user.passwordHash = helpers.encrypPassword(user.email, password);

          user.save((err) => {
            if (err) {
              return done(err);
            }

            return done(null, user);
          });
        })
        .catch((err) => {
          return done(err);
        });
    }
  ));

  passport.use('local-login', new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true
    },
    (req, email, password, done) => {
      User.findOne({ email: email })
        .then((user) => {
          var err;
          if (!user) {
            err = new Error('User not found.');
            err.status = 400;
            return done(err);
          }

          const passwordHash = helpers.encrypPassword(email, password);
          if (user.passwordHash === passwordHash) {
            return done(null, user);
          }

          err = new Error('Wrong password.');
          err.status = 400;
          return done(err);

        })
        .catch((err) => {
          return done(err);
        });
    }
  ))

  passport.serializeUser((user, done) => {
    return done(null, {
      id: user.id,
      name: user.firstName
    });
  });

  passport.deserializeUser((user, done) => {
    User.findById(user.id)
      .then((user) => {
        return done(null, {
          id: user.id,
          name: user.firstName
        });
      })
      .catch((err) => {
        return done(err);
      });
  });

  app.use(passport.initialize());
  app.use(passport.session());

  debug('> configured authentication.');
};
