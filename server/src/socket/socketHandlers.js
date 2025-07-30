const { v4: uuidv4 } = require('uuid');

// In-memory storage for active rooms and their canvas states
// In a production app, you might want to use Redis or another solution
const rooms = new Map();
const activeUsers = new Map();

/**
 * Initialize a room if it doesn't exist
 * @param {string} roomId - The room ID
 */
const initializeRoom = (roomId) => {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      users: new Map(),
      drawingActions: [],
      messages: []
    });
  }
};

/**
 * Setup all socket handlers
 * @param {Object} io - Socket.IO server instance
 */
const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    // Store user connection
    activeUsers.set(socket.id, {
      socketId: socket.id,
      userId: null,
      username: null,
      currentRoom: null
    });

    // Handle user joining a room
    socket.on('join_room', ({ roomId, userId, username }) => {
      console.log(`User ${username} (${userId}) joined room: ${roomId}`);
      
      // Initialize room if it doesn't exist
      initializeRoom(roomId);
      
      // Add user to room
      const room = rooms.get(roomId);
      room.users.set(socket.id, { userId, username });
      
      // Update user's current room
      const user = activeUsers.get(socket.id);
      if (user) {
        user.userId = userId;
        user.username = username;
        user.currentRoom = roomId;
      }
      
      // Join the socket room
      socket.join(roomId);
      
      // Notify others in the room
      socket.to(roomId).emit('user_joined', { userId, username });
      
      // Send current canvas state to the new user
      socket.emit('canvas_state', {
        drawingActions: room.drawingActions,
        messages: room.messages
      });
    });

    // Handle drawing actions
    socket.on('drawing_action', (drawingAction) => {
      const user = activeUsers.get(socket.id);
      if (!user || !user.currentRoom) return;
      
      const roomId = user.currentRoom;
      const room = rooms.get(roomId);
      
      if (!room) return;
      
      // Add unique ID to the drawing action if not present
      const actionWithId = {
        ...drawingAction,
        id: drawingAction.id || uuidv4(),
        userId: user.userId,
        username: user.username,
        timestamp: Date.now()
      };
      
      // Store the drawing action
      room.drawingActions.push(actionWithId);
      
      // Broadcast to others in the room
      socket.to(roomId).emit('drawing_action', actionWithId);
    });

    // Handle real-time drawing (for smoother experience)
    socket.on('drawing_start', (data) => {
      const user = activeUsers.get(socket.id);
      if (!user || !user.currentRoom) return;
      
      socket.to(user.currentRoom).emit('drawing_start', {
        ...data,
        userId: user.userId,
        username: user.username
      });
    });

    socket.on('drawing_move', (data) => {
      const user = activeUsers.get(socket.id);
      if (!user || !user.currentRoom) return;
      
      socket.to(user.currentRoom).emit('drawing_move', {
        ...data,
        userId: user.userId
      });
    });

    socket.on('drawing_end', (data) => {
      const user = activeUsers.get(socket.id);
      if (!user || !user.currentRoom) return;
      
      socket.to(user.currentRoom).emit('drawing_end', {
        ...data,
        userId: user.userId
      });
    });

    // Handle canvas clearing
    socket.on('clear_canvas', () => {
      const user = activeUsers.get(socket.id);
      if (!user || !user.currentRoom) return;
      
      const roomId = user.currentRoom;
      const room = rooms.get(roomId);
      
      if (!room) return;
      
      // Clear drawing actions
      room.drawingActions = [];
      
      // Broadcast to others in the room
      socket.to(roomId).emit('clear_canvas', { userId: user.userId, username: user.username });
    });

    // Handle chat messages
    socket.on('send_message', (message) => {
      const user = activeUsers.get(socket.id);
      if (!user || !user.currentRoom) return;
      
      const roomId = user.currentRoom;
      const room = rooms.get(roomId);
      
      if (!room) return;
      
      const newMessage = {
        _id: uuidv4(),
        roomId,
        userId: user.userId,
        username: user.username,
        content: message.content,
        createdAt: new Date()
      };
      
      // Store the message
      room.messages.push(newMessage);
      
      // Broadcast to everyone in the room including sender
      io.to(roomId).emit('receive_message', newMessage);
    });

    // Handle room creation
    socket.on('create_room', ({ name, isPrivate, password }) => {
      const roomId = uuidv4();
      initializeRoom(roomId);
      
      // Emit room created event
      socket.emit('room_created', { roomId, name, isPrivate });
    });

    // Handle get rooms request
    socket.on('get_rooms', () => {
      const publicRooms = [];
      
      rooms.forEach((room, roomId) => {
        // Only include public rooms
        if (!room.isPrivate) {
          publicRooms.push({
            roomId,
            name: room.name,
            participants: room.users.size
          });
        }
      });
      
      socket.emit('rooms_list', publicRooms);
    });

    // Handle user leaving a room
    socket.on('leave_room', () => {
      handleUserLeaving(socket);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      handleUserLeaving(socket);
      activeUsers.delete(socket.id);
    });
  });
};

/**
 * Handle user leaving a room
 * @param {Object} socket - Socket instance
 */
const handleUserLeaving = (socket) => {
  const user = activeUsers.get(socket.id);
  if (!user || !user.currentRoom) return;
  
  const roomId = user.currentRoom;
  const room = rooms.get(roomId);
  
  if (room) {
    // Remove user from room
    room.users.delete(socket.id);
    
    // Notify others in the room
    socket.to(roomId).emit('user_left', { userId: user.userId, username: user.username });
    
    // Leave the socket room
    socket.leave(roomId);
    
    // Clean up empty rooms
    if (room.users.size === 0) {
      rooms.delete(roomId);
    }
  }
  
  // Update user's current room
  user.currentRoom = null;
};

module.exports = setupSocketHandlers;