const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  accountType: { type: String, enum: ['user', 'agent'], default: 'user' },
  state: String,
  country: String,
  phone: String,
  address: String
});

module.exports = mongoose.model('User', userSchema);
