import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Initialize Firebase Admin
admin.initializeApp();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = functions.config().mongodb?.uri || 
                      process.env.MONGODB_URI || 
                      'mongodb+srv://lemaerick6:JGmSUq7YPKpQVXWx@cluster0.rjqsnnu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create Express app
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Sample route for testing
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', environment: process.env.NODE_ENV });
});

// Route for MongoDB testing
app.get('/test-mongodb', async (req, res) => {
  try {
    // This route will be implemented with the same logic as in the server
    res.status(200).json({ 
      message: 'MongoDB test route (implement based on your server code)',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'MongoDB test failed',
      error: error.message
    });
  }
});

// Connect to DB when app is initialized
connectDB().catch(console.error);

// Export the API as a Firebase Cloud Function
export const api = functions.https.onRequest(app);