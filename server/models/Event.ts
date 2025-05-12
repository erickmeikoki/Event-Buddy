import mongoose, { Schema, Document } from 'mongoose';
import { Event } from '@shared/schema';

// Define the interface for the Event document
export interface EventDocument extends Document, Omit<Event, 'id'> {
  // Additional properties not in schema.ts but needed for MongoDB
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
  attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create and export the Event model
export default mongoose.models.Event || mongoose.model<EventDocument>('Event', EventSchema);