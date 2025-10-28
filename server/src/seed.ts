import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Chat } from './models/Chat.js';
import { Message } from './models/Message.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined');
    }

    await mongoose.connect(mongoUri);

    await Chat.deleteMany({});
    await Message.deleteMany({});

    const chats = [
      {
        firstName: 'John',
        lastName: 'Doe',
        lastMessage: '',
        lastMessageTime: new Date(),
        userId: null
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        lastMessage: '',
        lastMessageTime: new Date(),
        userId: null
      },
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        lastMessage: '',
        lastMessageTime: new Date(),
        userId: null
      }
    ];

    const createdChats = await Chat.create(chats);
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

seedData();