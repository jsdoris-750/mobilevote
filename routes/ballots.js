const express = require('express');

const helpers = require("../lib/helpers.js");
const Ballot = require('../models/ballot');
const router = express.Router();
const Answer = require('../models/answer');

router.get('/:id', function (req, res, next) {
  Ballot.find({ 'election_id': req.params.id }, function (err, ballot) {
    if (err) {
      res.json(err);
    }
    res.json(ballot);
  });

});

router.post('/', function (req, res, next) {
  const answers = helpers.parseAnswers(req.body);

  answers.forEach(_ => {
    let answer = new Answer(_);
    answer.save();
  });

  res.json({status: 200});
});

module.exports = router;
