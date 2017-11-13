const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
  user_id: String,
  election_id: String,
  ballot_id: String,
  result: Schema.Types.Mixed
});

module.exports = mongoose.model('Answer', answerSchema);
