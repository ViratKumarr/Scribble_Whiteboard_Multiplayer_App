import { io, Socket } from 'socket.io-client';
import { SocketEvents, Message, DrawingAction, Room, User } from '../types';

// Create a socketService object to export all functions

let socket: Socket | null = null;

// Socket service object to export all functions
export const socketService = {
  /**
   * Register error event handler
   * @param callback Function to call when error occurs
   */
  onError: (callback: (errorMessage: string) => void): void => {
    if (socket) {
      socket.on(SocketEvents.ERROR, callback);
    }
  },

  /**
   * Register chat message event handler
   * @param callback Function to call when chat message is received
   */
  onChatMessage: (callback: (message: Message) => void): void => {
    if (socket) {
      socket.on(SocketEvents.RECEIVE_MESSAGE, callback);
    }
  },

  /**
   * Register drawing action event handler
   * @param callback Function to call when drawing action is received
   */
  onDrawingAction: (callback: (action: DrawingAction) => void): void => {
    if (socket) {
      socket.on(SocketEvents.DRAWING_ACTION, callback);
    }
  },

  /**
   * Register canvas cleared event handler
   * @param callback Function to call when canvas is cleared
   */
  onCanvasCleared: (callback: () => void): void => {
    if (socket) {
      socket.on(SocketEvents.CLEAR_CANVAS, callback);
    }
  },

  /**
   * Register canvas state event handler
   * @param callback Function to call when canvas state is received
   */
  onCanvasState: (callback: (imageData: string) => void): void => {
    if (socket) {
      socket.on(SocketEvents.CANVAS_STATE, callback);
    }
  },
  /**
   * Initialize socket connection
   * @returns Socket instance
   */
  initializeSocket: (): Socket => {
  if (!socket) {
    socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket']
    });

    // Setup event listeners
    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  return socket;
  },

  /**
   * Get socket instance
   * @returns Socket instance or null if not initialized
   */
  getSocket: (): Socket | null => {
  return socket;
  },

  /**
   * Join a room
   * @param roomId Room ID
   * @param userId User ID
   * @param username Username
   */
  joinRoom: (roomId: string, userId: string, username: string): void => {
  if (socket) {
    socket.emit(SocketEvents.JOIN_ROOM, { roomId, userId, username });
  }
  },

  /**
   * Leave current room
   */
  leaveRoom: (): void => {
  if (socket) {
    socket.emit(SocketEvents.LEAVE_ROOM);
  }
  },

  /**
   * Disconnect socket
   */
  disconnectSocket: (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  },

  /**
   * Send drawing action
   * @param drawingAction Drawing action data
   */
  sendDrawingAction: (drawingAction: any): void => {
  if (socket) {
    socket.emit(SocketEvents.DRAWING_ACTION, drawingAction);
  }
  },

  /**
   * Send drawing start event
   * @param data Drawing start data
   */
  sendDrawingStart: (data: any): void => {
  if (socket) {
    socket.emit(SocketEvents.DRAWING_START, data);
  }
  },

  /**
   * Send drawing move event
   * @param data Drawing move data
   */
  sendDrawingMove: (data: any): void => {
  if (socket) {
    socket.emit(SocketEvents.DRAWING_MOVE, data);
  }
  },

  /**
   * Send drawing end event
   * @param data Drawing end data
   */
  sendDrawingEnd: (data: any): void => {
  if (socket) {
    socket.emit(SocketEvents.DRAWING_END, data);
  }
  },

  /**
   * Clear canvas
   */
  clearCanvas: (): void => {
  if (socket) {
    socket.emit(SocketEvents.CLEAR_CANVAS);
  }
  },

  /**
   * Request canvas state
   */
  requestCanvasState: (): void => {
  if (socket) {
    socket.emit(SocketEvents.REQUEST_CANVAS_STATE);
  }
  },

  /**
   * Register room data event handler
   * @param callback Function to call when room data is received
   */
  onRoomData: (callback: (data: { room: Room, participants: User[] }) => void): void => {
    if (socket) {
      socket.on('roomData', callback);
    }
  },

  /**
   * Send chat message
   * @param content Message content
   */
  sendMessage: (content: string): void => {
  if (socket) {
    socket.emit(SocketEvents.SEND_MESSAGE, { content });
  }
  },

  /**
   * Create a new room
   * @param name Room name
   * @param isPrivate Whether the room is private
   * @param password Room password (optional)
   */
  createRoom: (name: string, isPrivate: boolean, password?: string): void => {
  if (socket) {
    socket.emit(SocketEvents.CREATE_ROOM, { name, isPrivate, password });
  }
  },

  /**
   * Get list of public rooms
   */
  getRooms: (): void => {
    if (socket) {
      socket.emit(SocketEvents.GET_ROOMS);
    }
  },

  /**
   * Register rooms updated event handler
   * @param callback Function to call when rooms list is updated
   */
  onRoomsUpdated: (callback: (rooms: Room[]) => void): void => {
    if (socket) {
      socket.on(SocketEvents.ROOMS_LIST, callback);
    }
  }
};