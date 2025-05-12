import mongoose, { Schema, Document } from 'mongoose';
import { Event } from '@shared/schema';

// Define the interface for the Event document
export interface EventDocument extends Document {
  // Properties from the Event type
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  category: string;
  imageUrl: string;
  priceRange?: string;
  featured?: boolean;
  
  // Additional properties for MongoDB
  numericId?: number;     // Added for compatibility with our app schema
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema for the Event model
const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String, required: true },
  priceRange: { type: String, required: true },
  organizerId: { type: Number },
  featured: { type: Boolean, default: false },
  numericId: { type: Number }, // Added for compatibility with our app schema
  attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create and export the Event model
export default mongoose.models.Event || mongoose.model<EventDocument>('Event', EventSchema);