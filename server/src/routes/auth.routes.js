const express = require('express');
const { register, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Get current user route (protected)
router.get('/me', protect, getMe);

module.exports = router;