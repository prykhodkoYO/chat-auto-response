import axios from 'axios';
import Cookies from 'js-cookie';
import { Chat, Message, CreateChatRequest, SendMessageRequest } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('auth_token');
    }
    return Promise.reject(error);
  }
);

export const chatAPI = {
  getAllChats: async (search?: string): Promise<Chat[]> => {
    const params = search ? { search } : {};
    const response = await api.get('/chats', { params });
    return response.data;
  },

  getChatById: async (id: string): Promise<Chat> => {
    const response = await api.get(`/chats/${id}`);
    return response.data;
  },

  createChat: async (data: CreateChatRequest): Promise<Chat> => {
    const response = await api.post('/chats', data);
    return response.data;
  },

  updateChat: async (id: string, data: CreateChatRequest): Promise<Chat> => {
    const response = await api.put(`/chats/${id}`, data);
    return response.data;
  },

  deleteChat: async (id: string): Promise<void> => {
    await api.delete(`/chats/${id}`);
  },
  getChatMessages: async (chatId: string, page = 1, limit = 50): Promise<Message[]> => {
    const response = await api.get(`/messages/${chatId}`, {
      params: { page, limit }
    });
    return response.data;
  },

  sendMessage: async (chatId: string, data: SendMessageRequest): Promise<Message> => {
    const response = await api.post(`/messages/${chatId}`, data);
    return response.data;
  },

  updateMessage: async (messageId: string, content: string): Promise<Message> => {
    const response = await api.put(`/messages/update/${messageId}`, { content });
    return response.data;
  },

  getLatestMessages: async (chatId: string, since?: string): Promise<Message[]> => {
    const params = since ? { since } : {};
    const response = await api.get(`/messages/${chatId}/latest`, { params });
    return response.data;
  },
};

export default api;