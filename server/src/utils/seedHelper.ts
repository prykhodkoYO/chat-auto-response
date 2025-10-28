import { Chat } from '../models/Chat.js';
import { Message } from '../models/Message.js';

export const ensurePredefinedChats = async () => {
  try {
    const existingGuestChats = await Chat.find({
      $or: [
        { userId: null },
        { userId: { $exists: false } }
      ]
    });

    if (existingGuestChats.length < 3) {
      await Chat.deleteMany({
        $or: [
          { userId: null },
          { userId: { $exists: false } }
        ]
      });
      const predefinedChats = [
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

      const createdChats = await Chat.create(predefinedChats);
      
    } else {
    }
  } catch (error) {
  }
};