const express = require('express');
const authController = require('../controllers/authController');
const passport = require('passport');
const User = require('../models/User');

const router = express.Router();

// Registration route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Logout route
router.get('/logout', authController.logout);


module.exports = router;
