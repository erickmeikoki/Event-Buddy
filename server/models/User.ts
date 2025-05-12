import mongoose, { Schema, Document } from 'mongoose';
import { User } from '@shared/schema';

// Define the interface for the User document
export interface UserDocument extends Document {
  // Properties from the User type
  username: string;
  displayName: string;
  email: string;
  profileImageUrl?: string;
  bio?: string;
  location?: string;
  
  // Additional properties for MongoDB
  numericId?: number;     // Added for compatibility with our app schema
  firebaseUid?: string;
  createdAt?: Date;
  updatedAt?: Date;
  interests?: any[];
}

// Define the schema for the User model
const UserSchema: Schema = new Schema({
  numericId: { type: Number, unique: true }, // Added for compatibility with our app schema
  displayName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  profileImageUrl: { type: String, default: '' },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  interests: [{ type: Number, ref: 'Interest' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  firebaseUid: { type: String, sparse: true, unique: true },
});

// Create and export the User model
export default mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);