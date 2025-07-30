/**
 * Socket.io manager for handling real-time communication
 */
const { verifyToken } = require('../utils/tokenUtils');

// Store active rooms and their data
const activeRooms = new Map();

// Store active user connections
const activeUsers = new Map();

/**
 * Initialize socket.io with the HTTP server
 * @param {object} server - HTTP server instance
 * @returns {object} - Configured socket.io instance
 */
const initializeSocketIO = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: Token required'));
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return next(new Error('Authentication error: Invalid token'));
    }
    
    // Attach user data to socket
    socket.userId = decoded.id;
    socket.username = socket.handshake.auth.username;
    next();
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    // Store user connection
    activeUsers.set(socket.userId, {
      socketId: socket.id,
      username: socket.username
    });

    // Join room handler
    socket.on('join-room', ({ roomId, username }) => {
      // Leave previous rooms
      Array.from(socket.rooms).forEach(room => {
        if (room !== socket.id) {
          socket.leave(room);
        }
      });

      // Join new room
      socket.join(roomId);
      
      // Initialize room if it doesn't exist
      if (!activeRooms.has(roomId)) {
        activeRooms.set(roomId, {
          users: [],
          canvasState: null,
          messages: []
        });
      }
      
      const roomData = activeRooms.get(roomId);
      
      // Add user to room if not already present
      if (!roomData.users.some(user => user.id === socket.userId)) {
        roomData.users.push({
          id: socket.userId,
          username,
          socketId: socket.id
        });
      }
      
      // Notify room about new user
      io.to(roomId).emit('user-joined', {
        userId: socket.userId,
        username,
        users: roomData.users
      });
      
      // Send current canvas state to new user
      if (roomData.canvasState) {
        socket.emit('canvas-state', roomData.canvasState);
      }
      
      // Send message history to new user
      socket.emit('message-history', roomData.messages);
    });

    // Drawing event handler
    socket.on('draw', ({ roomId, drawData }) => {
      // Broadcast to all users in the room except sender
      socket.to(roomId).emit('draw-update', {
        userId: socket.userId,
        username: socket.username,
        drawData
      });
    });

    // Canvas state update handler
    socket.on('canvas-state-update', ({ roomId, canvasState }) => {
      if (activeRooms.has(roomId)) {
        const roomData = activeRooms.get(roomId);
        roomData.canvasState = canvasState;
        activeRooms.set(roomId, roomData);
      }
    });

    // Chat message handler
    socket.on('send-message', ({ roomId, message }) => {
      if (!activeRooms.has(roomId)) return;
      
      const roomData = activeRooms.get(roomId);
      const newMessage = {
        id: Date.now().toString(),
        userId: socket.userId,
        username: socket.username,
        text: message,
        timestamp: new Date().toISOString()
      };
      
      // Store message in room history (limit to last 100 messages)
      roomData.messages.push(newMessage);
      if (roomData.messages.length > 100) {
        roomData.messages.shift();
      }
      
      // Broadcast message to all users in the room
      io.to(roomId).emit('new-message', newMessage);
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      
      // Remove user from active users
      activeUsers.delete(socket.userId);
      
      // Remove user from all rooms they were in
      activeRooms.forEach((roomData, roomId) => {
        const userIndex = roomData.users.findIndex(user => user.id === socket.userId);
        
        if (userIndex !== -1) {
          roomData.users.splice(userIndex, 1);
          
          // Notify room about user leaving
          io.to(roomId).emit('user-left', {
            userId: socket.userId,
            users: roomData.users
          });
          
          // If room is empty, remove it
          if (roomData.users.length === 0) {
            activeRooms.delete(roomId);
          }
        }
      });
    });
  });

  return io;
};

module.exports = { initializeSocketIO };