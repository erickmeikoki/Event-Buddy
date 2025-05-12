import mongoose from 'mongoose';

// Connect to MongoDB
const MONGODB_URI = 'mongodb+srv://lemaerick6:JGmSUq7YPKpQVXWx@cluster0.rjqsnnu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
      console.log('MongoDB connected successfully');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;