import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  googleId?: string;
  email: string;
  name: string;
  avatar?: string;
  isGuest: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  isGuest: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>('User', userSchema);