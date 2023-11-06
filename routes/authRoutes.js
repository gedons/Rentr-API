const express = require('express');
const authController = require('../controllers/authController');
const User = require('../models/User');

const router = express.Router();

// Registration route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Logout route
router.get('/logout', authController.logout);

// Email verification route
router.get('/verify/:token', async (req, res) => {
    try {
      const user = await User.findOne({ verificationToken: req.params.token });
  
      if (user) {
        if (user.verificationTokenExpiry && user.verificationTokenExpiry < Date.now()) {
          // Token has expired
          res.status(400).json({ message: 'Token has expired. Please request a new verification email.' });
        } else {
          user.isEmailVerified = true;
          user.verificationToken = undefined;
          user.verificationTokenExpiry = undefined; 
          await user.save();
          res.status(200).json({ message: 'Email verified successfully' });
        }
      } else {
        res.status(404).json({ message: 'Invalid or expired token' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Verification failed' });
    }
});

//Resend verification email route
router.post('/resend-verification-email', authController.resendVerification );


module.exports = router;
