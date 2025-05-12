import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as admin from "firebase-admin";
import { Event, User, Message, BuddyRequest, Interest } from "@shared/schema";
import cors from "cors";
import { fetchChicagoEvents, fetchFeaturedChicagoEvents } from "./services/chicagoEvents";

// Initialize Firebase Admin SDK
try {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}'
  );
  
  if (serviceAccount.project_id) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    console.warn("Firebase service account key not provided. Some functionality may be limited.");
  }
} catch (error) {
  console.error("Error initializing Firebase Admin SDK:", error);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Enable CORS
  app.use(cors());

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'healthy' });
  });
  
  // Test endpoint to create a sample user and retrieve it
  app.get('/api/test-mongodb', async (_req, res) => {
    try {
      // Create a test user
      const timestamp = Date.now();
      const testUser = {
        username: 'testuser_' + timestamp,
        displayName: 'Test User',
        email: `test${timestamp}@example.com`,
        bio: 'This is a test user created to verify MongoDB integration',
        profileImageUrl: null,
        location: 'Test City',
        uid: 'test_' + timestamp
      };
      
      console.log('Creating test user...');
      const createdUser = await storage.createUser(testUser);
      console.log('User created with ID:', createdUser.id);
      
      // Find user by numericId
      console.log('Attempting to retrieve user with ID:', createdUser.id);
      const retrievedUser = await storage.getUser(createdUser.id);
      
      // Import UserModel to query directly
      import('../server/models/User').then(async (UserModule) => {
        const UserModel = UserModule.default;
        const allUsers = await UserModel.find({}).lean();
        console.log('Found', allUsers.length, 'users in database');
        
        // Look specifically for the just-created user
        const foundUserDirect = allUsers.find(u => u.numericId === createdUser.id);
        console.log('User found directly from MongoDB:', !!foundUserDirect);
      }).catch(err => {
        console.error('Error querying MongoDB directly:', err);
      });
      
      res.status(200).json({
        message: 'MongoDB test results',
        created: createdUser,
        retrieved: retrievedUser,
        success: retrievedUser !== undefined
      });
    } catch (error) {
      console.error('MongoDB test failed:', error);
      res.status(500).json({
        message: 'MongoDB test failed',
        error: error.message
      });
    }
  });

  // User routes
  app.get('/api/users/:id', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  });

  app.post('/api/users', async (req, res) => {
    try {
      const userData = req.body;
      const newUser = await storage.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Failed to create user' });
    }
  });

  // Event routes
  app.get('/api/events', async (req, res) => {
    try {
      const { category, source } = req.query;
      
      // If source=chicago, fetch from Chicago API
      if (source === 'chicago') {
        // Pass the category to fetchChicagoEvents
        const events = await fetchChicagoEvents(
          category && category !== 'All Events' ? category as string : undefined, 
          50
        );
        res.status(200).json(events);
      } else {
        // Otherwise use our storage
        const events = await storage.getEvents(category as string | undefined);
        res.status(200).json(events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ message: 'Failed to fetch events' });
    }
  });

  app.get('/api/events/featured', async (req, res) => {
    try {
      const { source } = req.query;
      
      // If source=chicago, fetch featured events from Chicago API
      if (source === 'chicago') {
        const featuredEvents = await fetchFeaturedChicagoEvents(5);
        res.status(200).json(featuredEvents);
      } else {
        // Otherwise use our storage
        const featuredEvents = await storage.getFeaturedEvents();
        res.status(200).json(featuredEvents);
      }
    } catch (error) {
      console.error('Error fetching featured events:', error);
      res.status(500).json({ message: 'Failed to fetch featured events' });
    }
  });
  
  // Dedicated endpoint for Chicago events
  app.get('/api/chicago-events', async (req, res) => {
    try {
      const { limit = '50', category } = req.query;
      const numLimit = parseInt(limit as string) || 50;
      
      // Pass category directly to the fetchChicagoEvents function
      const categoryParam = category && category !== 'All Events' 
        ? category as string 
        : undefined;
        
      const events = await fetchChicagoEvents(categoryParam, numLimit);
      res.status(200).json(events);
    } catch (error) {
      console.error('Error fetching Chicago events:', error);
      res.status(500).json({ message: 'Failed to fetch Chicago events' });
    }
  });

  app.get('/api/events/:id', async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await storage.getEvent(eventId);
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      res.status(200).json(event);
    } catch (error) {
      console.error('Error fetching event:', error);
      res.status(500).json({ message: 'Failed to fetch event' });
    }
  });

  // Buddy request routes
  app.post('/api/buddy-requests', async (req, res) => {
    try {
      const requestData = req.body;
      const newRequest = await storage.createBuddyRequest(requestData);
      res.status(201).json(newRequest);
    } catch (error) {
      console.error('Error creating buddy request:', error);
      res.status(500).json({ message: 'Failed to create buddy request' });
    }
  });

  app.get('/api/buddy-requests/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const requests = await storage.getBuddyRequests(userId);
      res.status(200).json(requests);
    } catch (error) {
      console.error('Error fetching buddy requests:', error);
      res.status(500).json({ message: 'Failed to fetch buddy requests' });
    }
  });

  app.patch('/api/buddy-requests/:id', async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!['pending', 'accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
      
      await storage.updateBuddyRequestStatus(requestId, status);
      res.status(200).json({ message: 'Buddy request updated successfully' });
    } catch (error) {
      console.error('Error updating buddy request:', error);
      res.status(500).json({ message: 'Failed to update buddy request' });
    }
  });

  // Message routes
  app.post('/api/messages', async (req, res) => {
    try {
      const messageData = req.body;
      const newMessage = await storage.createMessage(messageData);
      res.status(201).json(newMessage);
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ message: 'Failed to create message' });
    }
  });

  app.get('/api/messages/:user1Id/:user2Id', async (req, res) => {
    try {
      const user1Id = parseInt(req.params.user1Id);
      const user2Id = parseInt(req.params.user2Id);
      const messages = await storage.getMessages(user1Id, user2Id);
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Failed to fetch messages' });
    }
  });

  app.patch('/api/messages/read', async (req, res) => {
    try {
      const { messageIds } = req.body;
      
      if (!Array.isArray(messageIds)) {
        return res.status(400).json({ message: 'Message IDs must be an array' });
      }
      
      await storage.markMessagesAsRead(messageIds);
      res.status(200).json({ message: 'Messages marked as read' });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      res.status(500).json({ message: 'Failed to mark messages as read' });
    }
  });

  // Interest routes
  app.get('/api/interests', async (req, res) => {
    try {
      const interests = await storage.getInterests();
      res.status(200).json(interests);
    } catch (error) {
      console.error('Error fetching interests:', error);
      res.status(500).json({ message: 'Failed to fetch interests' });
    }
  });

  app.post('/api/user-interests', async (req, res) => {
    try {
      const { userId, interestId } = req.body;
      await storage.addUserInterest(userId, interestId);
      res.status(201).json({ message: 'User interest added successfully' });
    } catch (error) {
      console.error('Error adding user interest:', error);
      res.status(500).json({ message: 'Failed to add user interest' });
    }
  });

  app.delete('/api/user-interests/:userId/:interestId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const interestId = parseInt(req.params.interestId);
      await storage.removeUserInterest(userId, interestId);
      res.status(200).json({ message: 'User interest removed successfully' });
    } catch (error) {
      console.error('Error removing user interest:', error);
      res.status(500).json({ message: 'Failed to remove user interest' });
    }
  });

  // Initialize HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
