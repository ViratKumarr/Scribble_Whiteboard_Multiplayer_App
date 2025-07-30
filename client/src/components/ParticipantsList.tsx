import React from 'react';
import { User } from '../types';

interface ParticipantsListProps {
  participants: User[];
}

/**
 * ParticipantsList component for displaying users in the current room
 */
const ParticipantsList: React.FC<ParticipantsListProps> = ({ participants }) => {
  return (
    <div className="participants-panel">
      <h3 className="panel-title">Participants ({participants.length})</h3>
      
      <div className="participants-list">
        {participants.length === 0 ? (
          <div className="no-participants">No participants yet</div>
        ) : (
          <ul>
            {participants.map(participant => (
              <li key={participant.id} className="participant-item">
                <div className="participant-avatar">
                  {participant.avatar ? (
                    <img src={participant.avatar} alt={participant.username} />
                  ) : (
                    <div className="avatar-placeholder">
                      {participant.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="participant-name">{participant.username}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ParticipantsList;