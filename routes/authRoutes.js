const express = require('express');
const authController = require('../controllers/authController');
const User = require('../models/User');
const bcrypt = require('bcrypt');

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

//Resend verification email route (if verification codes expires in 20 minutes)
router.post('/resend-verification-email', authController.resendVerification );

// Password reset request route (user enter mail)
router.get('/password-reset', authController.passwordReset);

// Password reset route (reset link in user email. this is to riderect to new password page)
router.get('/reset/:token', async (req, res) => {
    try {
      const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
      }
  
      // Implement password reset UI here(redirect to enter new password page)


    } catch (error) {
      res.status(500).json({ message: 'Error processing password reset' });
    }
});

// Password reset process route (enter new password)
router.post('/reset/:token', async (req, res) => {
    const { newPassword } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    try {
      const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
      }
  
      user.password = hashedPassword; // Set the new password
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
  
      await user.save();
  
      return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      res.status(500).json({ message: 'Error resetting password' });
    }
});

module.exports = router;
