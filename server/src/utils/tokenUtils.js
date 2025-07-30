/**
 * JWT token utilities
 */
const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for a user
 * @param {object} user - User object with id
 * @returns {string} - JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {object} - Decoded token payload or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Extract token from request headers
 * @param {object} req - Express request object
 * @returns {string|null} - JWT token or null if not found
 */
const getTokenFromRequest = (req) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  
  // If no token in Authorization header, check cookies
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  
  return null;
};

module.exports = {
  generateToken,
  verifyToken,
  getTokenFromRequest
};