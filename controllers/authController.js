const User = require('../models/User');
const { generateVerificationToken, sendVerificationEmail } = require('../config/emailVerify'); 
const passport = require('passport');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  const { username, email, password, accountType, state, country, phone, address } = req.body;

  // Check if the email is already registered
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email is already registered' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate a random verification token
  const token = generateVerificationToken();

  // Create a new user
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    accountType, 
    state,
    country,
    phone,
    address,
    verificationToken: token,
  });

  try {
    await newUser.save();
    sendVerificationEmail(newUser);
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: `Registration failed : ${error}` });
  }
};

exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: 'Server error', err });
      }
      if (!user) {
        return res.status(401).json({ message: 'Authentication details not correct' });
      }
      if (!user.isEmailVerified) {
        return res.status(401).json({ message: 'Email is not verified' });
      }
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ message: 'Server error', loginErr });
        }
        return res.status(200).json({ message: 'Login successful' });
      });
    })(req, res, next);
};

exports.logout = (req, res) => {
// Destroy the user's session and log them out 
req.logout();

// Clear the session cookie
req.session.destroy((err) => {
    if (err) {
    return res.status(500).json({ message: 'Logout failed' });
    }
    
    // Redirect to a success or logout page, or you can simply return a success message
    res.status(200).json({ message: 'Logout successful' });
});
};

exports.resendVerification = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        if (user.isEmailVerified) {
          return res.status(400).json({ message: 'Email is already verified' });
        }
    
        const token = generateVerificationToken();  
        user.verificationToken = token;
        user.verificationTokenExpiry = Date.now() + 20 * 60 * 1000;  
        await user.save();
    
        sendVerificationEmail(user);  
    
        return res.status(200).json({ message: 'Verification email sent' });
      } catch (error) {
        res.status(500).json({ message: 'Error sending verification email' });
      }
};
  
