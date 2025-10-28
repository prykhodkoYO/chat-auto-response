import React from 'react';
import { Chat } from '../../types';
import './ChatList.css';

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onChatSelect: (chat: Chat) => void;
  onEditChat: (chat: Chat) => void;
  onDeleteChat: (chatId: string) => void;
  onCreateChat: () => void;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  selectedChatId,
  onChatSelect,
  onEditChat,
  onDeleteChat,
  onCreateChat
}) => {
  const formatTime = (timestamp?: string): string => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) {
      return 'now';
    }
    
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m`;
    }
    
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h`;
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="chat-list">
      <button 
        className="add-chat-btn"
        onClick={onCreateChat}
        title="Create new chat"
      >
        + Start new chat
      </button>
      
      {chats.length === 0 ? (
        <div className="empty-state">
          <p>No chats found</p>
        </div>
      ) : (
        chats.map((chat) => (
          <div
            key={chat._id}
            className={`chat-item ${selectedChatId === chat._id ? 'selected' : ''}`}
            onClick={() => onChatSelect(chat)}
          >
            <div className="chat-avatar">
              {chat.firstName.charAt(0).toUpperCase()}{chat.lastName.charAt(0).toUpperCase()}
            </div>
            
            <div className="chat-info">
              <div className="chat-name">{chat.fullName || `${chat.firstName} ${chat.lastName}`}</div>
              <div className="chat-last-message">
                {chat.lastMessage || 'No messages yet'}
              </div>
            </div>
            
            <div className="chat-meta">
              <div className="chat-time">{formatTime(chat.lastMessageTime)}</div>
              <div className="chat-actions">
                <button
                  className="chat-action-btn edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditChat(chat);
                  }}
                  title="Edit chat"
                >
                  ✏️
                </button>
                <button
                  className="chat-action-btn delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Are you sure you want to delete this chat?')) {
                      onDeleteChat(chat._id);
                    }
                  }}
                  title="Delete chat"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatList;