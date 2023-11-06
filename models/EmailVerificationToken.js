const mongoose = require('mongoose');

const emailVerificationTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiration: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('EmailVerificationToken', emailVerificationTokenSchema);
