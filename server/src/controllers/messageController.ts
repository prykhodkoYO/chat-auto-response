import { Request, Response } from 'express';
import { Chat } from '../models/Chat.js';
import { Message } from '../models/Message.js';
import dummyJsonService from '../services/dummyJsonService.js';

export const getChatMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const messages = await Message.find({ chatId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    
    if (!content || content.trim() === '') {
      res.status(400).json({ error: 'Message content is required' });
      return;
    }
    
    const chat = await Chat.findById(chatId);
    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }
    
    const userMessage = new Message({
      chatId,
      content: content.trim(),
      sender: 'user',
      timestamp: new Date()
    });
    
    const savedUserMessage = await userMessage.save();
    
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: content.trim(),
      lastMessageTime: new Date()
    });
    
    res.status(201).json(savedUserMessage);
    
    setTimeout(async () => {
      try {
        const quote = await dummyJsonService.getRandomQuote();
        
        const botMessage = new Message({
          chatId,
          content: quote,
          sender: 'bot',
          timestamp: new Date()
        });
        
        await botMessage.save();
        
        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: quote,
          lastMessageTime: new Date()
        });
        
      } catch (error) {
      }
    }, 3000);
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const updateMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    
    if (!content || content.trim() === '') {
      res.status(400).json({ error: 'Message content is required' });
      return;
    }
    
    const message = await Message.findById(messageId);
    if (!message) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }
    
    if (message.sender !== 'user') {
      res.status(403).json({ error: 'Cannot edit bot messages' });
      return;
    }
    
    message.content = content.trim();
    message.timestamp = new Date();
    
    const updatedMessage = await message.save();
    res.json(updatedMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update message' });
  }
};

export const getLatestMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;
    const { since } = req.query;
    
    let query: any = { chatId };
    
    if (since) {
      query.timestamp = { $gt: new Date(since as string) };
    }
    
    const messages = await Message.find(query).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch latest messages' });
  }
};