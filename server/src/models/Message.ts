import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  _id: string;
  chatId: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const messageSchema = new Schema<IMessage>({
  chatId: {
    type: String,
    required: true,
    ref: 'Chat'
  },
  content: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    enum: ['user', 'bot'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export const Message = mongoose.model<IMessage>('Message', messageSchema);