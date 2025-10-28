import mongoose, { Document, Schema } from 'mongoose';

export interface IChat extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  lastMessage: {
    type: String,
    default: ''
  },
  lastMessageTime: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

chatSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

chatSchema.set('toJSON', {
  virtuals: true
});

export const Chat = mongoose.model<IChat>('Chat', chatSchema);