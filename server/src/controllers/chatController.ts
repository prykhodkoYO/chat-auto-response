import { Request, Response } from 'express';
import { Chat } from '../models/Chat.js';
import { Message } from '../models/Message.js';

export const getAllChats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;
    const userId = req.user?.id;
    
    let query: any = {};
    
    if (userId) {
      query.userId = userId;
    } else {
      query.$or = [
        { userId: null },
        { userId: { $exists: false } }
      ];
    }
    
    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      const searchQuery = {
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex }
        ]
      };
      
      if (query.$or) {
        query = {
          $and: [
            { $or: query.$or },
            searchQuery
          ]
        };
      } else {
        query = { ...query, ...searchQuery };
      }
    }
    
    const chats = await Chat.find(query).sort({ lastMessageTime: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
};

export const getChatById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const chat = await Chat.findById(id);
    
    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }
    
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
};

export const createChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName } = req.body;
    const userId = req.user?.id;
    
    if (!firstName || !lastName) {
      res.status(400).json({ error: 'First name and last name are required' });
      return;
    }
    
    const newChat = new Chat({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      userId: userId || null
    });
    
    const savedChat = await newChat.save();
    res.status(201).json(savedChat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chat' });
  }
};

export const updateChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { firstName, lastName } = req.body;
    
    if (!firstName || !lastName) {
      res.status(400).json({ error: 'First name and last name are required' });
      return;
    }
    
    const updatedChat = await Chat.findByIdAndUpdate(
      id,
      { 
        firstName: firstName.trim(), 
        lastName: lastName.trim() 
      },
      { new: true }
    );
    
    if (!updatedChat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }
    
    res.json(updatedChat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update chat' });
  }
};

export const deleteChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    await Message.deleteMany({ chatId: id });
    
    const deletedChat = await Chat.findByIdAndDelete(id);
    
    if (!deletedChat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }
    
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete chat' });
  }
};