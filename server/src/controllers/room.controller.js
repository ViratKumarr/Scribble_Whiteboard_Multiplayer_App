const Room = require('../models/room.model');

/**
 * @desc    Create a new room
 * @route   POST /api/rooms
 * @access  Private
 */
exports.createRoom = async (req, res) => {
  try {
    const { name, isPrivate, password } = req.body;

    // Create new room
    const room = await Room.create({
      name,
      createdBy: req.user.id,
      participants: [req.user.id],
      isPrivate: isPrivate || false,
      password: isPrivate && password ? password : undefined
    });

    res.status(201).json({
      success: true,
      data: {
        room: {
          _id: room._id,
          name: room.name,
          createdBy: room.createdBy,
          participants: room.participants,
          isPrivate: room.isPrivate,
          createdAt: room.createdAt,
          updatedAt: room.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc    Get all public rooms
 * @route   GET /api/rooms
 * @access  Public
 */
exports.getRooms = async (req, res) => {
  try {
    // Get all public rooms
    const rooms = await Room.find({ isPrivate: false })
      .populate('createdBy', 'username')
      .populate('participants', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: { rooms }
    });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc    Get room by ID
 * @route   GET /api/rooms/:id
 * @access  Public/Private (depends on room privacy)
 */
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('participants', 'username');

    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }

    // Check if room is private and user is not a participant
    if (room.isPrivate && !req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required for private rooms'
      });
    }

    if (room.isPrivate && !room.participants.some(p => p._id.toString() === req.user.id)) {
      return res.status(403).json({
        success: false,
        error: 'You are not a participant in this room'
      });
    }

    res.status(200).json({
      success: true,
      data: { room }
    });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc    Join a room
 * @route   POST /api/rooms/:id/join
 * @access  Private
 */
exports.joinRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).select('+password');

    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }

    // Check if user is already a participant
    if (room.participants.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        error: 'You are already a participant in this room'
      });
    }

    // Check if room is private and requires password
    if (room.isPrivate && room.password) {
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({
          success: false,
          error: 'Password is required for this room'
        });
      }

      const isMatch = await room.comparePassword(password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid password'
        });
      }
    }

    // Add user to participants
    room.participants.push(req.user.id);
    await room.save();

    res.status(200).json({
      success: true,
      data: {
        room: {
          _id: room._id,
          name: room.name,
          createdBy: room.createdBy,
          participants: room.participants,
          isPrivate: room.isPrivate,
          createdAt: room.createdAt,
          updatedAt: room.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc    Leave a room
 * @route   POST /api/rooms/:id/leave
 * @access  Private
 */
exports.leaveRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }

    // Check if user is a participant
    if (!room.participants.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        error: 'You are not a participant in this room'
      });
    }

    // Remove user from participants
    room.participants = room.participants.filter(
      (participant) => participant.toString() !== req.user.id
    );

    // If room is empty and not created by the system, delete it
    if (room.participants.length === 0) {
      await Room.findByIdAndDelete(room._id);
      return res.status(200).json({
        success: true,
        data: { message: 'Room deleted as it has no participants left' }
      });
    }

    // If the user leaving is the creator, transfer ownership to the next participant
    if (room.createdBy.toString() === req.user.id && room.participants.length > 0) {
      room.createdBy = room.participants[0];
    }

    await room.save();

    res.status(200).json({
      success: true,
      data: { message: 'Successfully left the room' }
    });
  } catch (error) {
    console.error('Leave room error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc    Save canvas state
 * @route   PUT /api/rooms/:id/canvas
 * @access  Private
 */
exports.saveCanvasState = async (req, res) => {
  try {
    const { canvasState } = req.body;
    
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }

    // Check if user is a participant
    if (!room.participants.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: 'You are not a participant in this room'
      });
    }

    // Update canvas state
    room.canvasState = canvasState;
    room.lastActive = Date.now();
    await room.save();

    res.status(200).json({
      success: true,
      data: { message: 'Canvas state saved successfully' }
    });
  } catch (error) {
    console.error('Save canvas state error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};