const express = require('express');
const {
  createRoom,
  getRooms,
  getRoomById,
  joinRoom,
  leaveRoom,
  saveCanvasState
} = require('../controllers/room.controller');
const { protect, optionalAuth } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all public rooms
router.get('/', getRooms);

// Create a new room (protected)
router.post('/', protect, createRoom);

// Get room by ID (optional auth for public rooms, required for private)
router.get('/:id', optionalAuth, getRoomById);

// Join a room (protected)
router.post('/:id/join', protect, joinRoom);

// Leave a room (protected)
router.post('/:id/leave', protect, leaveRoom);

// Save canvas state (protected)
router.put('/:id/canvas', protect, saveCanvasState);

module.exports = router;