const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  accountType: { type: String, enum: ['user', 'agent'], default: 'user' },
  state: String,
  country: String,
  phone: String,
  address: String,
  verificationToken: String,  
  verificationTokenExpiry: Date,
  isEmailVerified: { type: Boolean, default: false }, 
  resetPasswordToken: String,  
  resetPasswordExpires: Date,
});

module.exports = mongoose.model('User', userSchema);
