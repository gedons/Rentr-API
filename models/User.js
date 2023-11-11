const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  accountType: { type: String, enum: ['user', 'agent', 'owner'], default: 'user' },
  state: { type: String, required: false},
  country: { type: String, required: false},
  phone: String,
  address: { type: String, required: false},
  verificationToken: String,  
  verificationTokenExpiry: Date,
  isEmailVerified: { type: Boolean, default: false }, 
  resetPasswordToken: String,  
  resetPasswordExpires: Date,
});

module.exports = mongoose.model('User', userSchema);
