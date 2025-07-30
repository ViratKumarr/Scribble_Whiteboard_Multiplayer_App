/**
 * Validation utilities for request data
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid and message
 */
const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters long'
    };
  }

  return { isValid: true };
};

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {object} - Validation result with isValid and message
 */
const validateUsername = (username) => {
  if (!username || username.length < 3) {
    return {
      isValid: false,
      message: 'Username must be at least 3 characters long'
    };
  }

  if (username.length > 20) {
    return {
      isValid: false,
      message: 'Username cannot exceed 20 characters'
    };
  }

  // Only allow alphanumeric characters and underscores
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return {
      isValid: false,
      message: 'Username can only contain letters, numbers, and underscores'
    };
  }

  return { isValid: true };
};

/**
 * Validate room name
 * @param {string} roomName - Room name to validate
 * @returns {object} - Validation result with isValid and message
 */
const validateRoomName = (roomName) => {
  if (!roomName || roomName.trim().length < 3) {
    return {
      isValid: false,
      message: 'Room name must be at least 3 characters long'
    };
  }

  if (roomName.length > 30) {
    return {
      isValid: false,
      message: 'Room name cannot exceed 30 characters'
    };
  }

  return { isValid: true };
};

module.exports = {
  isValidEmail,
  validatePassword,
  validateUsername,
  validateRoomName
};