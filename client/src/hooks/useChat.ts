import React, { useState, useEffect, useCallback } from 'react';
import { Chat, Message } from '../types';
import { chatAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import MessageToast from '../components/MessageToast/MessageToast';

export const useChat = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadChats = useCallback(async (search?: string) => {
    try {
      setLoading(true);
      const data = await chatAPI.getAllChats(search);
      setChats(data);
    } catch (error) {
      toast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (chatId: string) => {
    try {
      const data = await chatAPI.getChatMessages(chatId);
      setMessages(data);
    } catch (error) {
      toast.error('Failed to load messages');
    }
  }, []);

  const createChat = useCallback(async (firstName: string, lastName: string) => {
    try {
      const newChat = await chatAPI.createChat({ firstName, lastName });
      setChats(prev => [newChat, ...prev]);
      toast.success(`Chat with ${newChat.fullName} created!`);
      return newChat;
    } catch (error) {
      toast.error('Failed to create chat');
      throw error;
    }
  }, []);

  const updateChat = useCallback(async (chatId: string, firstName: string, lastName: string) => {
    try {
      const updatedChat = await chatAPI.updateChat(chatId, { firstName, lastName });
      setChats(prev => prev.map(chat => 
        chat._id === chatId ? updatedChat : chat
      ));
      if (selectedChat?._id === chatId) {
        setSelectedChat(updatedChat);
      }
      toast.success(`Chat updated to ${updatedChat.fullName}`);
      return updatedChat;
    } catch (error) {
      toast.error('Failed to update chat');
      throw error;
    }
  }, [selectedChat]);

  const deleteChat = useCallback(async (chatId: string) => {
    try {
      await chatAPI.deleteChat(chatId);
      setChats(prev => prev.filter(chat => chat._id !== chatId));
      if (selectedChat?._id === chatId) {
        setSelectedChat(null);
        setMessages([]);
      }
      toast.success('Chat deleted successfully');
    } catch (error) {
      toast.error('Failed to delete chat');
    }
  }, [selectedChat]);

  const sendMessage = useCallback(async (content: string) => {
    if (!selectedChat) return;

    try {
      const message = await chatAPI.sendMessage(selectedChat._id, { content });
      setMessages(prev => [...prev, message]);
      
      setChats(prev => prev.map(chat => 
        chat._id === selectedChat._id 
          ? { ...chat, lastMessage: content, lastMessageTime: message.timestamp }
          : chat
      ));

      setTimeout(async () => {
        try {
          const latestMessages = await chatAPI.getLatestMessages(
            selectedChat._id, 
            message.timestamp
          );
          
          if (latestMessages.length > 0) {
            const botMessage = latestMessages.find(msg => msg.sender === 'bot');
            if (botMessage) {
              setMessages(prev => [...prev, botMessage]);
              
              setChats(prev => prev.map(chat => 
                chat._id === selectedChat._id 
                  ? { ...chat, lastMessage: botMessage.content, lastMessageTime: botMessage.timestamp }
                  : chat
              ));

              const senderName = selectedChat.fullName || `${selectedChat.firstName} ${selectedChat.lastName}`;
              
              toast.info(
                React.createElement(MessageToast, {
                  senderName: senderName,
                  message: botMessage.content,
                  isBot: true
                }),
                {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                }
              );
            }
          }
        } catch (error) {
        }
      }, 3500);

    } catch (error) {
      toast.error('Failed to send message');
    }
  }, [selectedChat]);

  const selectChat = useCallback((chat: Chat) => {
    setSelectedChat(chat);
    loadMessages(chat._id);
  }, [loadMessages]);

  const searchChats = useCallback((query: string) => {
    setSearchQuery(query);
    loadChats(query);
  }, [loadChats]);

  const updateMessage = useCallback(async (messageId: string, content: string) => {
    try {
      const updatedMessage = await chatAPI.updateMessage(messageId, content);
      
      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? updatedMessage : msg
      ));
      
      toast.success('Message updated successfully');
      return updatedMessage;
    } catch (error) {
      toast.error('Failed to update message');
      throw error;
    }
  }, []);

  useEffect(() => {
    loadChats();
    setSelectedChat(null);
    setMessages([]);
  }, [loadChats, user]);

  return {
    chats,
    selectedChat,
    messages,
    loading,
    searchQuery,
    createChat,
    updateChat,
    deleteChat,
    sendMessage,
    updateMessage,
    selectChat,
    searchChats,
    refreshChats: loadChats
  };
};