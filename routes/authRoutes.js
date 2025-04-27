const express = require('express');
const router = express.Router();
const { login, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/login', login);

// Protected routes
router.get('/me', protect, getCurrentUser);

module.exports = router; 