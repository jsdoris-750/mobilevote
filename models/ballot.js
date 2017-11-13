/*
 *  In this model,
 *  - retrieve the ballots for the elections
 * 
 */
/* In this model,
 * - list all the active elections
 * - list all the finished elections
 */
const mongoose = require('mongoose');

Schema = mongoose.Schema

const ballotSchema = new Schema({
  "election_id": String,
  "group_id": Number,
  "title": String,
  "type": Number,
  "description": String,
  "options" : [Schema.Types.Mixed]
},{strict: false});

module.exports = mongoose.model('ballots', ballotSchema);
