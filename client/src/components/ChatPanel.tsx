import React, { useState, useRef, useEffect } from 'react';
import { Message, User } from '../types';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  currentUser: User | null;
}

/**
 * ChatPanel component for displaying and sending chat messages
 */
const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, currentUser }) => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  const formatTimestamp = (timestamp: Date | string) => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-panel">
      <h3 className="panel-title">Chat</h3>
      
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="no-messages">No messages yet. Start the conversation!</div>
        ) : (
          messages.map(message => (
            <div 
              key={message._id} 
              className={`chat-message ${message.userId === currentUser?.id ? 'own-message' : ''}`}
            >
              <div className="message-header">
                <span className="message-sender">{message.username}</span>
                <span className="message-time">{formatTimestamp(message.createdAt)}</span>
              </div>
              <div className="message-content">{message.content}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button type="submit" className="chat-send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;