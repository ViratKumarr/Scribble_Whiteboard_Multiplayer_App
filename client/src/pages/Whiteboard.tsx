import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { socketService } from '../services/socket';
import { Room, DrawingAction, Message, User, DrawingTool } from '../types';
import ChatPanel from '../components/ChatPanel';
import ToolPanel from '../components/ToolPanel';
import ParticipantsList from '../components/ParticipantsList';

/**
 * Whiteboard page component for the collaborative drawing canvas
 */
const Whiteboard: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [toolSettings, setToolSettings] = useState({
    color: '#000000',
    lineWidth: 5,
    tool: DrawingTool.PEN
  });

  // Initialize canvas and socket connection
  useEffect(() => {
    if (!roomId || !user) {
      navigate('/rooms');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    canvas.style.width = `${canvas.offsetWidth}px`;
    canvas.style.height = `${canvas.offsetHeight}px`;

    // Get canvas context
    const context = canvas.getContext('2d');
    if (!context) return;

    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = toolSettings.color;
    context.lineWidth = toolSettings.lineWidth;
    contextRef.current = context;

    // Initialize socket if not already connected
    if (!socketService.getSocket()) {
      socketService.initializeSocket();
    }

    // Join the room
    try {
      socketService.joinRoom(roomId, user.id, user.username);
    } catch (err) {
      console.error('Error joining room:', err);
      setError('Failed to join the room. Please try again.');
      navigate('/rooms');
    }

    // Request current canvas state
    socketService.requestCanvasState();

    // Set up socket event listeners
    setupSocketListeners();

    // Clean up on component unmount
    return () => {
      if (roomId && user) {
        socketService.leaveRoom();
      }
      removeSocketListeners();
    };
  }, [roomId, user, navigate]);

  // Update context when tool settings change
  useEffect(() => {
    if (!contextRef.current) return;
    
    contextRef.current.strokeStyle = toolSettings.tool === DrawingTool.ERASER ? '#FFFFFF' : toolSettings.color;
    contextRef.current.lineWidth = toolSettings.lineWidth;
  }, [toolSettings]);

  const setupSocketListeners = () => {
    // Room data update
    socketService.onRoomData((data) => {
      setRoom(data.room);
      setParticipants(data.participants);
    });

    // Drawing actions from other users
    socketService.onDrawingAction((action) => {
      if (!contextRef.current) return;
      
      switch (action.type) {
        case 'start':
          handleDrawStart(action, false);
          break;
        case 'move':
          handleDrawMove(action, false);
          break;
        case 'end':
          handleDrawEnd(false);
          break;
        default:
          break;
      }
    });

    // Canvas cleared by another user
    socketService.onCanvasCleared(() => {
      clearCanvas();
    });

    // Receive canvas state when joining
    socketService.onCanvasState((imageData) => {
      loadCanvasState(imageData);
    });

    // Chat messages
    socketService.onChatMessage((message) => {
      setMessages(prev => [...prev, message]);
    });

    // Error handling
    socketService.onError((errorMessage) => {
      setError(errorMessage);
    });
  };

  const removeSocketListeners = () => {
    const socket = socketService.getSocket();
    if (!socket) return;
    
    socket.off('roomData');
    socket.off('drawingAction');
    socket.off('canvasCleared');
    socket.off('canvasState');
    socket.off('chatMessage');
    socket.off('error');
  };

  const handleDrawStart = (action: DrawingAction, emit: boolean = true) => {
    if (!contextRef.current) return;
    
    const { x, y, color, size } = action;
    const ctx = contextRef.current;
    
    ctx.beginPath();
    ctx.moveTo(x || 0, y || 0);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    
    setIsDrawing(true);
    
    if (emit && roomId) {
      socketService.sendDrawingAction({
        id: Date.now().toString(),
        roomId,
        userId: user?.id || '',
        username: user?.username || '',
        type: 'start',
        tool: toolSettings.tool,
        x,
        y,
        color: toolSettings.tool === DrawingTool.ERASER ? '#FFFFFF' : toolSettings.color,
        size: toolSettings.lineWidth,
        opacity: 1,
        points: [{ x, y }],
        timestamp: Date.now()
      });
    }
  };

  const handleDrawMove = (action: DrawingAction, emit: boolean = true) => {
    if (!isDrawing || !contextRef.current) return;
    
    const { x, y } = action;
    const ctx = contextRef.current;
    
    ctx.lineTo(x || 0, y || 0);
    ctx.stroke();
    
    if (emit && roomId) {
      socketService.sendDrawingAction({
        id: Date.now().toString(),
        roomId,
        userId: user?.id || '',
        username: user?.username || '',
        type: 'move',
        tool: toolSettings.tool,
        x,
        y,
        color: toolSettings.tool === DrawingTool.ERASER ? '#FFFFFF' : toolSettings.color,
        size: toolSettings.lineWidth,
        opacity: 1,
        points: [{ x, y }],
        timestamp: Date.now()
      });
    }
  };

  const handleDrawEnd = (emit: boolean = true) => {
    if (!contextRef.current) return;
    
    contextRef.current.closePath();
    setIsDrawing(false);
    
    if (emit && roomId) {
      socketService.sendDrawingAction({
        id: Date.now().toString(),
        roomId,
        userId: user?.id || '',
        username: user?.username || '',
        type: 'end',
        tool: toolSettings.tool,
        x: 0,
        y: 0,
        color: toolSettings.color,
        size: toolSettings.lineWidth,
        opacity: 1,
        points: [],
        timestamp: Date.now()
      });
    }
  };

  const clearCanvas = () => {
    if (!canvasRef.current || !contextRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    
    ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
    
    if (roomId) {
      socketService.clearCanvas();
    }
  };

  const loadCanvasState = (imageData: string) => {
    if (!canvasRef.current || !contextRef.current || !imageData) return;
    
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
      ctx.drawImage(img, 0, 0, canvas.width / 2, canvas.height / 2);
    };
    img.src = imageData;
  };

  const saveCanvasState = () => {
    if (!canvasRef.current || !roomId) return;
    
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL('image/png');
    
    // Save canvas state functionality to be implemented
    console.log('Canvas saved locally:', imageData.substring(0, 50) + '...');
  };

  const sendMessage = (text: string) => {
    if (!roomId || !user || !text.trim()) return;
    
    // Create a message object for local state
    const message = {
      _id: Date.now().toString(),
      roomId,
      userId: user.id,
      username: user.username,
      content: text,
      createdAt: new Date()
    };
    
    // Send the message content to the server
    socketService.sendMessage(text);
    
    // Update local state with the new message
    setMessages(prev => [...prev, message]);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (rect.width / canvas.width) / 2;
    const y = (e.clientY - rect.top) / (rect.height / canvas.height) / 2;
    
    handleDrawStart({
      id: Date.now().toString(),
      type: 'start',
      roomId: roomId || '',
      userId: user?.id || '',
      username: user?.username || '',
      tool: toolSettings.tool,
      x,
      y,
      color: toolSettings.tool === DrawingTool.ERASER ? '#FFFFFF' : toolSettings.color,
      size: toolSettings.lineWidth,
      opacity: 1,
      points: [{ x, y }],
      timestamp: Date.now()
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (rect.width / canvas.width) / 2;
    const y = (e.clientY - rect.top) / (rect.height / canvas.height) / 2;
    
    handleDrawMove({
      id: Date.now().toString(),
      type: 'move',
      roomId: roomId || '',
      userId: user?.id || '',
      username: user?.username || '',
      tool: toolSettings.tool,
      x,
      y,
      color: toolSettings.color,
      size: toolSettings.lineWidth,
      opacity: 1,
      points: [{ x, y }],
      timestamp: Date.now()
    });
  };

  const handleMouseUp = () => {
    handleDrawEnd();
  };

  const handleMouseLeave = () => {
    handleDrawEnd();
  };

  const handleToolChange = (settings: typeof toolSettings) => {
    setToolSettings(settings);
  };

  return (
    <div className="whiteboard-container">
      {error && <div className="whiteboard-error">{error}</div>}
      
      <div className="whiteboard-header">
        <h1 className="room-name">{room?.name || 'Loading...'}</h1>
        <div className="whiteboard-actions">
          <button className="action-button" onClick={clearCanvas}>Clear Canvas</button>
          <button className="action-button" onClick={saveCanvasState}>Save Canvas</button>
          <button className="action-button" onClick={() => navigate('/rooms')}>Exit Room</button>
        </div>
      </div>
      
      <div className="whiteboard-content">
        <div className="whiteboard-sidebar left">
          <ToolPanel 
            settings={toolSettings} 
            onSettingsChange={handleToolChange} 
          />
          <ParticipantsList participants={participants} />
        </div>
        
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            className="drawing-canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          />
        </div>
        
        <div className="whiteboard-sidebar right">
          <ChatPanel 
            messages={messages} 
            onSendMessage={sendMessage} 
            currentUser={user} 
          />
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;