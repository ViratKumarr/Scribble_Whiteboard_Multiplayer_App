import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { socketService } from '../services/socket';
import { Room } from '../types';

/**
 * Rooms page component for displaying and managing available rooms
 */
const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [password, setPassword] = useState('');
  const [newRoomData, setNewRoomData] = useState({
    name: '',
    isPrivate: false,
    password: ''
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize socket connection if not already connected
    if (!socketService.getSocket()) {
      socketService.initializeSocket();
    }

    // Fetch rooms on component mount
    fetchRooms();

    // Listen for room updates
    socketService.onRoomsUpdated((updatedRooms) => {
      setRooms(updatedRooms);
    });

    return () => {
      // Clean up socket listeners
      socketService.getSocket()?.off('roomsUpdated');
    };
  }, []);

  const fetchRooms = () => {
    setIsLoading(true);
    setError(null);
    try {
      socketService.getRooms();
      // The rooms will be updated via the onRoomsUpdated event handler
    } catch (err) {
      setError('Failed to fetch rooms. Please try again.');
      console.error('Error fetching rooms:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newRoomData.name.trim()) {
        setError('Room name is required');
        return;
      }

      if (newRoomData.isPrivate && !newRoomData.password) {
        setError('Password is required for private rooms');
        return;
      }

      socketService.createRoom(
        newRoomData.name,
        newRoomData.isPrivate,
        newRoomData.isPrivate ? newRoomData.password : undefined
      );
      
      // We'll need to listen for room creation event to get the room ID
      // For now, we'll just redirect to rooms page
      setRooms([...rooms, {
        _id: Date.now().toString(),
        id: Date.now().toString(),
        name: newRoomData.name,
        isPrivate: newRoomData.isPrivate,
        createdBy: user?.id || '',
        participants: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }]);

      setShowCreateModal(false);
      setNewRoomData({
        name: '',
        isPrivate: false,
        password: ''
      });

      // Navigate to the rooms list for now
      // In a real implementation, we would listen for room creation event
      // and navigate to the new room with its ID
      navigate('/rooms');
    } catch (err) {
      setError('Failed to create room. Please try again.');
      console.error('Error creating room:', err);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedRoom) return;

      if (selectedRoom.isPrivate && !password) {
        setError('Password is required to join this room');
        return;
      }

      socketService.joinRoom(
        selectedRoom.id,
        user?.id || '',
        user?.username || ''
      );

      setShowJoinModal(false);
      setPassword('');
      setSelectedRoom(null);

      // Navigate to the joined room
      navigate(`/whiteboard/${selectedRoom.id}`);
    } catch (err) {
      setError('Failed to join room. Please check your password and try again.');
      console.error('Error joining room:', err);
    }
  };

  const openJoinModal = (room: Room) => {
    setSelectedRoom(room);
    setShowJoinModal(true);
    setError(null);
  };

  const handleCreateModalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewRoomData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="rooms-container">
      <div className="rooms-header">
        <h1 className="rooms-title">Available Rooms</h1>
        <button 
          className="create-room-button" 
          onClick={() => {
            setShowCreateModal(true);
            setError(null);
          }}
        >
          Create New Room
        </button>
      </div>

      {error && <div className="rooms-error">{error}</div>}

      {isLoading ? (
        <div className="rooms-loading">Loading rooms...</div>
      ) : rooms.length === 0 ? (
        <div className="rooms-empty">
          <p>No rooms available. Create a new room to get started!</p>
        </div>
      ) : (
        <div className="rooms-grid">
          {rooms.map(room => (
            <div key={room.id} className="room-card">
              <div className="room-card-header">
                <h3 className="room-name">{room.name}</h3>
                {room.isPrivate && (
                  <span className="room-private-badge" title="Private Room">
                    🔒
                  </span>
                )}
              </div>
              <div className="room-card-body">
                <p className="room-creator">Created by: {room.creator?.username || 'Unknown'}</p>
                <p className="room-participants">
                  {room.participants.length} {room.participants.length === 1 ? 'participant' : 'participants'}
                </p>
              </div>
              <div className="room-card-footer">
                <button 
                  className="join-room-button" 
                  onClick={() => openJoinModal(room)}
                >
                  Join Room
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New Room</h2>
              <button 
                className="modal-close" 
                onClick={() => setShowCreateModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleCreateRoom}>
              <div className="form-group">
                <label htmlFor="name">Room Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newRoomData.name}
                  onChange={handleCreateModalChange}
                  required
                  placeholder="Enter room name"
                />
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="isPrivate"
                  name="isPrivate"
                  checked={newRoomData.isPrivate}
                  onChange={handleCreateModalChange}
                />
                <label htmlFor="isPrivate">Private Room</label>
              </div>
              
              {newRoomData.isPrivate && (
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={newRoomData.password}
                    onChange={handleCreateModalChange}
                    placeholder="Enter room password"
                  />
                </div>
              )}
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-button" 
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="create-button">
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {showJoinModal && selectedRoom && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Join Room: {selectedRoom.name}</h2>
              <button 
                className="modal-close" 
                onClick={() => setShowJoinModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleJoinRoom}>
              {selectedRoom.isPrivate && (
                <div className="form-group">
                  <label htmlFor="join-password">Password</label>
                  <input
                    type="password"
                    id="join-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter room password"
                    required
                  />
                </div>
              )}
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-button" 
                  onClick={() => setShowJoinModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="join-button">
                  Join Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;