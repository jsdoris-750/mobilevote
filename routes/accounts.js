const express = require('express');
const passport = require("passport");
const middleware = require('../lib/middleware');

const helpers = require("../lib/helpers.js");

const router = express.Router();

router.get('/login',
  middleware.ensureLoggedOut,
  function (req, res, next) {
    return res.render('login', { title: 'Sign In' });
  });

router.post('/login',
  passport.authenticate('local-login', {
    failWithError: true
  }),
  (req, res, next) => {
    // handle success
    return res.redirect('/');
  },
  (err, req, res, next) => {
    // handle error
    return res.render('login', { title: 'Sign In', err: err });
  });

router.get('/register',
  middleware.ensureLoggedOut,
  function (req, res, next) {
    return res.render('register', { title: 'Register' });
  });

// POST /api/users gets JSON bodies
router.post('/register',
  passport.authenticate('local-register', {
    failWithError: true
  }),
  (req, res, next) => {
    // handle success
    return res.redirect('/');
  },
  (err, req, res, next) => {
    // handle error
    return res.render('register', { title: 'Register', err: err });
  });

// global route
router.get('/', function (req, res, next) {
  if (req.user) {
    return res.render('index', { title: 'Welcome, ' + req.user.firstname, user: user });
  }

  return req.render('index');
});

module.exports = router;
