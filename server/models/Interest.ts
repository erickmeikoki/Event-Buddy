import mongoose, { Schema, Document } from 'mongoose';
import { Interest } from '@shared/schema';

// Define the interface for the Interest document
export interface InterestDocument extends Document, Omit<Interest, 'id'> {
  // Add any additional methods if needed
}

// Define the schema for the Interest model
const InterestSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create and export the Interest model
export default mongoose.models.Interest || mongoose.model<InterestDocument>('Interest', InterestSchema);