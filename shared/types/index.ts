// Shared types between client and server

// User related types
export interface User {
  _id: string;
  id: string; // Alias for _id to maintain compatibility
  username: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistration extends UserCredentials {
  username: string;
  confirmPassword: string;
}

// Authentication related types
export interface AuthResponse {
  user: User;
  token: string;
}

// Drawing related types
export interface Point {
  x: number;
  y: number;
}

export enum DrawingTool {
  PEN = 'pen',
  ERASER = 'eraser',
  LINE = 'line',
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  TEXT = 'text'
}

export interface DrawingSettings {
  tool: DrawingTool;
  color: string;
  size: number;
  opacity: number;
}

export interface DrawingAction {
  id: string;
  type?: string; // Type of drawing action (start, move, end)
  userId: string;
  username: string;
  tool: DrawingTool;
  color: string;
  size: number;
  opacity: number;
  points: Point[];
  text?: string;
  timestamp: number;
  roomId?: string; // Room ID for the drawing action
  x?: number; // X coordinate for single point actions
  y?: number; // Y coordinate for single point actions
}

// Room related types
export interface Room {
  _id: string;
  id: string; // Alias for _id to maintain compatibility
  name: string;
  createdBy: string;
  creator?: User; // Creator user object
  participants: string[] | User[]; // Can be array of IDs or User objects
  isPrivate: boolean;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoomCreation {
  name: string;
  isPrivate: boolean;
  password?: string;
}

// Message related types
export interface Message {
  _id: string;
  roomId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: Date;
}

// Socket event types
export enum SocketEvents {
  // Connection events
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  JOIN_ROOM = 'join_room',
  LEAVE_ROOM = 'leave_room',
  USER_JOINED = 'user_joined',
  USER_LEFT = 'user_left',
  
  // Drawing events
  DRAWING_ACTION = 'drawing_action',
  DRAWING_START = 'drawing_start',
  DRAWING_MOVE = 'drawing_move',
  DRAWING_END = 'drawing_end',
  CLEAR_CANVAS = 'clear_canvas',
  REQUEST_CANVAS_STATE = 'request_canvas_state',
  CANVAS_STATE = 'canvas_state',
  
  // Chat events
  SEND_MESSAGE = 'send_message',
  RECEIVE_MESSAGE = 'receive_message',
  
  // Room events
  CREATE_ROOM = 'create_room',
  ROOM_CREATED = 'room_created',
  GET_ROOMS = 'get_rooms',
  ROOMS_LIST = 'rooms_list',
  
  // Error events
  ERROR = 'error'
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}