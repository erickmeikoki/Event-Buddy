import mongoose, { Schema, Document } from 'mongoose';
import { Message } from '@shared/schema';

// Define the interface for the Message document
export interface MessageDocument extends Document {
  // Properties from the Message type
  senderId: any;
  receiverId: any;
  content: string;
  read?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema for the Message model
const MessageSchema: Schema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create and export the Message model
export default mongoose.models.Message || mongoose.model<MessageDocument>('Message', MessageSchema);