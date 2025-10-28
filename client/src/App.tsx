import React, { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ChatList from './components/ChatList/ChatList';
import ChatWindow from './components/ChatWindow/ChatWindow';
import MessageInput from './components/MessageInput/MessageInput';
import CreateChatDialog from './components/CreateChatDialog/CreateChatDialog';
import SearchBar from './components/SearchBar/SearchBar';
import LoginButton from './components/LoginButton/LoginButton';
import UserProfile from './components/UserProfile/UserProfile';
import { useChat } from './hooks/useChat';
import { Chat } from './types';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const {
    chats,
    selectedChat,
    messages,
    loading,
    createChat,
    updateChat,
    deleteChat,
    sendMessage,
    updateMessage,
    selectChat,
    searchChats
  } = useChat();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingChat, setEditingChat] = useState<Chat | null>(null);

  const handleCreateChat = () => {
    setEditingChat(null);
    setIsCreateDialogOpen(true);
  };

  const handleEditChat = (chat: Chat) => {
    setEditingChat(chat);
    setIsCreateDialogOpen(true);
  };

  const handleDialogSubmit = async (firstName: string, lastName: string) => {
    if (editingChat) {
      await updateChat(editingChat._id, firstName, lastName);
    } else {
      await createChat(firstName, lastName);
    }
    setIsCreateDialogOpen(false);
    setEditingChat(null);
  };

  const handleDialogClose = () => {
    setIsCreateDialogOpen(false);
    setEditingChat(null);
  };

  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="app loading">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-sidebar">
        <div className="sidebar-header">
          {user ? (
            <UserProfile />
          ) : (
            <div className="guest-header">
              <div className="user-profile">
                <div className="user-avatar">👤</div>
              </div>
              <LoginButton compact />
            </div>
          )}
        </div>

        <div className="search-section">
          <SearchBar
            onSearch={searchChats}
            placeholder="Search or start new chat"
          />
        </div>

        <div className="chats-section">
          <div className="chats-header">Chats</div>
          <ChatList
            chats={chats}
            selectedChatId={selectedChat?._id || null}
            onChatSelect={selectChat}
            onEditChat={handleEditChat}
            onDeleteChat={deleteChat}
            onCreateChat={handleCreateChat}
          />
        </div>
      </div>
      
      <div className="app-main">
        {selectedChat ? (
          <>
            <div className="chat-header">
              <div className="chat-header-avatar">
                {selectedChat.firstName.charAt(0).toUpperCase()}{selectedChat.lastName.charAt(0).toUpperCase()}
              </div>
              <div className="chat-header-name">
                {selectedChat.fullName || `${selectedChat.firstName} ${selectedChat.lastName}`}
              </div>
            </div>

            <div className="messages-container">
              <ChatWindow
                chat={selectedChat}
                messages={messages}
                onSendMessage={sendMessage}
                onUpdateMessage={updateMessage}
                onEditChat={handleEditChat}
              />
            </div>

            <MessageInput onSendMessage={sendMessage} />
          </>
        ) : (
          <div className="no-chat-selected">
            <h3>Select a chat to start messaging</h3>
          </div>
        )}
      </div>

      <CreateChatDialog
        isOpen={isCreateDialogOpen}
        chat={editingChat || undefined}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
      />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading...</div>
        </div>
      )}
    </div>
  );
}

const AppWithProviders: React.FC = () => {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id';
  
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default AppWithProviders;
