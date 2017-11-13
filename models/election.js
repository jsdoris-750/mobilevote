/* In this model,
 * - list all the active elections
 * - list all the finished elections
 */
const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  election_date: String
});

module.exports = mongoose.model('elections', electionSchema);
