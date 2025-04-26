const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Public routes
router.post('/login', authController.login);

// Protected routes
router.use(authController.authenticateToken);
router.post('/users', authController.createUser);
router.get('/users', authController.getUsers);

module.exports = router; 