const express = require('express');
const router = express.Router();
const Election = require('../models/election');
const Answers = require('../models/answer');
const helpers = require('../lib/helpers');

router.get('/active', function (req, res, next) {
  Election.find({ election_date: helpers.getCurrentDate() })
    .then((elections) => {

      Answers.find({user_id: res.locals.user.id})
        .then((answers) => {
          res.json({elections: elections, answers:answers});
        })
        .catch((err) => {
          res.json(err);
        });
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get('/complete', function(req, res, next){
  Election.find({ election_date: { $lt: helpers.getCurrentDate() }})
    .then((elections) => {
      res.json(elections);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
