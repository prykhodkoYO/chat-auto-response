import React, { useState, useEffect, useRef } from 'react';
import { Chat, Message } from '../../types';
import './ChatWindow.css';

interface ChatWindowProps {
  chat: Chat | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onUpdateMessage: (messageId: string, content: string) => void;
  onEditChat: (chat: Chat) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  messages,
  onSendMessage,
  onUpdateMessage,
  onEditChat
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartEdit = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditContent(content);
  };

  const handleSaveEdit = async (messageId: string) => {
    if (editContent.trim() === '') return;
    
    try {
      await onUpdateMessage(messageId, editContent.trim());
      setEditingMessageId(null);
      setEditContent('');
    } catch (error) {
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditContent('');
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'user') {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 3500);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [messages]);

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  if (!chat) {
    return (
      <div className="chat-window-empty">
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <h3>Welcome to ChatApp</h3>
          <p>Select a chat from the list to start messaging, or create a new chat to begin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-window-header">
        <div className="chat-info">
          <div className="chat-avatar">
            {chat.firstName.charAt(0).toUpperCase()}{chat.lastName.charAt(0).toUpperCase()}
          </div>
          <div className="chat-details">
            <h3>{chat.fullName}</h3>
            <span className="chat-status">Online</span>
          </div>
        </div>
        <button
          className="edit-chat-btn"
          onClick={() => onEditChat(chat)}
          title="Edit chat details"
        >
          ✏️
        </button>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message._id}
                className={`message ${message.sender === 'user' ? 'user' : 'bot'}`}
              >
                <div className="message-avatar">
                  {message.sender === 'user' ? '👤' : '👤'}
                </div>
                <div className="message-content">
                  <div className="message-sender-name">
                    {message.sender === 'user' 
                      ? 'You' 
                      : chat ? `${chat.firstName} ${chat.lastName}` : 'Bot'
                    }
                  </div>
                  <div className="message-bubble">
                    {editingMessageId === message._id ? (
                      <div className="edit-message-container">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="edit-message-input"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSaveEdit(message._id);
                            } else if (e.key === 'Escape') {
                              handleCancelEdit();
                            }
                          }}
                        />
                        <div className="edit-message-actions">
                          <button onClick={() => handleSaveEdit(message._id)} className="save-btn">
                            Save
                          </button>
                          <button onClick={handleCancelEdit} className="cancel-btn">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p>{message.content}</p>
                        {message.sender === 'user' && (
                          <button
                            className="edit-message-btn"
                            onClick={() => handleStartEdit(message._id, message.content)}
                            title="Edit message"
                          >
                            ✏️
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  <div className="message-time">{formatTime(message.timestamp)}</div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot typing-indicator">
                <div className="message-avatar">👤</div>
                <div className="message-content">
                  <div className="message-sender-name">
                    {chat ? `${chat.firstName} ${chat.lastName}` : 'Bot'}
                  </div>
                  <div className="message-bubble">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <div className="message-time">typing...</div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;