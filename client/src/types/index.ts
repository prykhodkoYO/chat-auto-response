export interface Chat {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  lastMessage?: string;
  lastMessageTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  chatId: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export interface CreateChatRequest {
  firstName: string;
  lastName: string;
}

export interface SendMessageRequest {
  content: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}