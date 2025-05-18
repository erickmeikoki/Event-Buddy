import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import axios from "axios";

// Initialize Firebase Admin
admin.initializeApp();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI =
      functions.config().mongodb?.uri ||
      process.env.MONGODB_URI ||
      "mongodb+srv://lemaerick6:JGmSUq7YPKpQVXWx@cluster0.rjqsnnu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Create Express app
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Sample route for testing
app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "healthy", environment: process.env.NODE_ENV });
});

// Route for MongoDB testing
app.get("/test-mongodb", async (req, res) => {
  try {
    // This route will be implemented with the same logic as in the server
    res.status(200).json({
      message: "MongoDB test route (implement based on your server code)",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      message: "MongoDB test failed",
      error: error.message,
    });
  }
});

// Define a simple Event schema for demonstration
const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  category: String,
  venue: String,
  location: String,
  date: String,
  time: String,
  priceRange: String,
  featured: Boolean,
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

const CHICAGO_EVENTS_API_URL =
  "https://data.cityofchicago.org/api/views/pk66-w54g/rows.json?accessType=DOWNLOAD";

// Helper to transform Chicago API data to your event format
function transformChicagoEvents(apiData: any): Array<any> {
  if (!apiData || !apiData.data) return [];
  return apiData.data.map((row: any) => ({
    title: row[8] || "Chicago Event",
    description: row[9] || "",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb", // Placeholder
    category: row[10] || "Event",
    venue: row[11] || "",
    location: row[12] || "Chicago, IL",
    date: row[13] || "",
    time: row[14] || "",
    priceRange: "Free",
    featured: false,
  }));
}

// GET /api/events - fetch all events or proxy to Chicago API
app.get("/api/events", async (req, res) => {
  try {
    if (req.query.source === "chicago") {
      const response = await axios.get(CHICAGO_EVENTS_API_URL);
      const events = transformChicagoEvents(response.data);
      res.status(200).json(events);
      return;
    }
    const events = await Event.find({});
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching events",
      error: (error as Error).message,
    });
  }
});

// GET /api/events/featured - fetch featured events or proxy to Chicago API
app.get("/api/events/featured", async (req, res) => {
  try {
    if (req.query.source === "chicago") {
      const response = await axios.get(CHICAGO_EVENTS_API_URL);
      const events = transformChicagoEvents(response.data).filter(
        (e: any) => e.featured
      );
      res.status(200).json(events);
      return;
    }
    const events = await Event.find({ featured: true });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching featured events",
      error: (error as Error).message,
    });
  }
});

// Connect to DB when app is initialized
connectDB().catch(console.error);

// Export the API as a Firebase Cloud Function
export const api = functions.https.onRequest(app);
