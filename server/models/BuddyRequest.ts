import mongoose, { Schema, Document } from 'mongoose';
import { BuddyRequest } from '@shared/schema';

// Define the interface for the BuddyRequest document
export interface BuddyRequestDocument extends Document {
  // Properties from the BuddyRequest type
  requesterId: any;
  receiverId: any;
  eventId: any;
  message?: string | null;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema for the BuddyRequest model
const BuddyRequestSchema: Schema = new Schema({
  requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  message: { type: String },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create and export the BuddyRequest model
export default mongoose.models.BuddyRequest || mongoose.model<BuddyRequestDocument>('BuddyRequest', BuddyRequestSchema);