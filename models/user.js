const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  passwordHash: String,
  firstName: String,
  lastName: String
});

module.exports = mongoose.model('User', userSchema);
