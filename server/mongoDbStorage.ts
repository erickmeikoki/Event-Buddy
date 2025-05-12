import { 
  User as UserModel, 
  Event as EventModel, 
  Interest as InterestModel, 
  BuddyRequest as BuddyRequestModel, 
  Message as MessageModel,
  UserDocument, EventDocument, InterestDocument, BuddyRequestDocument, MessageDocument
} from './models';
import { IStorage } from './storage';
import { 
  User, Event, Interest, BuddyRequest, Message,
  InsertUser, InsertEvent, InsertInterest, InsertBuddyRequest, InsertMessage
} from '@shared/schema';
import connectDB from './mongodb';
import mongoose from 'mongoose';

export class MongoDBStorage implements IStorage {
  constructor() {
    // Connect to MongoDB when storage is initialized
    connectDB();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    try {
      const user = await UserModel.findById(id);
      if (!user) return undefined;
      return this.convertUserToSchema(user);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findOne({ username });
      if (!user) return undefined;
      return this.convertUserToSchema(user);
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async getUserByFirebaseUid(uid: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findOne({ firebaseUid: uid });
      if (!user) return undefined;
      return this.convertUserToSchema(user);
    } catch (error) {
      console.error('Error getting user by Firebase UID:', error);
      return undefined;
    }
  }

  async createUser(userData: InsertUser): Promise<User> {
    try {
      const newUser = new UserModel(userData);
      const savedUser = await newUser.save();
      return this.convertUserToSchema(savedUser);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(id, 
        { ...userData, updatedAt: new Date() }, 
        { new: true }
      );
      if (!updatedUser) throw new Error(`User with ID ${id} not found`);
      return this.convertUserToSchema(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Event operations
  async getEvent(id: number): Promise<Event | undefined> {
    try {
      const event = await EventModel.findById(id);
      if (!event) return undefined;
      return this.convertEventToSchema(event);
    } catch (error) {
      console.error('Error getting event:', error);
      return undefined;
    }
  }

  async getEvents(category?: string): Promise<Event[]> {
    try {
      const query = category ? { category } : {};
      const events = await EventModel.find(query);
      return events.map(event => this.convertEventToSchema(event));
    } catch (error) {
      console.error('Error getting events:', error);
      return [];
    }
  }

  async getFeaturedEvents(): Promise<Event[]> {
    try {
      const featuredEvents = await EventModel.find({ featured: true });
      return featuredEvents.map(event => this.convertEventToSchema(event));
    } catch (error) {
      console.error('Error getting featured events:', error);
      return [];
    }
  }

  async createEvent(eventData: InsertEvent): Promise<Event> {
    try {
      const newEvent = new EventModel(eventData);
      const savedEvent = await newEvent.save();
      return this.convertEventToSchema(savedEvent);
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  // Interest operations
  async getInterests(): Promise<Interest[]> {
    try {
      const interests = await InterestModel.find();
      return interests.map(interest => this.convertInterestToSchema(interest));
    } catch (error) {
      console.error('Error getting interests:', error);
      return [];
    }
  }

  async createInterest(interestData: InsertInterest): Promise<Interest> {
    try {
      const newInterest = new InterestModel(interestData);
      const savedInterest = await newInterest.save();
      return this.convertInterestToSchema(savedInterest);
    } catch (error) {
      console.error('Error creating interest:', error);
      throw error;
    }
  }

  async getUserInterests(userId: number): Promise<Interest[]> {
    try {
      const user = await UserModel.findById(userId).populate('interests');
      if (!user) return [];
      
      return (user.interests || []).map((interest: any) => 
        this.convertInterestToSchema(interest)
      );
    } catch (error) {
      console.error('Error getting user interests:', error);
      return [];
    }
  }

  async addUserInterest(userId: number, interestId: number): Promise<void> {
    try {
      await UserModel.findByIdAndUpdate(
        userId,
        { $addToSet: { interests: interestId } },
        { new: true }
      );
    } catch (error) {
      console.error('Error adding user interest:', error);
      throw error;
    }
  }

  async removeUserInterest(userId: number, interestId: number): Promise<void> {
    try {
      await UserModel.findByIdAndUpdate(
        userId,
        { $pull: { interests: interestId } },
        { new: true }
      );
    } catch (error) {
      console.error('Error removing user interest:', error);
      throw error;
    }
  }

  // Buddy Request operations
  async getBuddyRequests(userId: number): Promise<BuddyRequest[]> {
    try {
      const requests = await BuddyRequestModel.find({
        $or: [{ senderId: userId }, { receiverId: userId }]
      });
      return requests.map(request => this.convertBuddyRequestToSchema(request));
    } catch (error) {
      console.error('Error getting buddy requests:', error);
      return [];
    }
  }

  async createBuddyRequest(requestData: InsertBuddyRequest): Promise<BuddyRequest> {
    try {
      const newRequest = new BuddyRequestModel(requestData);
      const savedRequest = await newRequest.save();
      return this.convertBuddyRequestToSchema(savedRequest);
    } catch (error) {
      console.error('Error creating buddy request:', error);
      throw error;
    }
  }

  async updateBuddyRequestStatus(requestId: number, status: string): Promise<void> {
    try {
      await BuddyRequestModel.findByIdAndUpdate(
        requestId,
        { status, updatedAt: new Date() },
        { new: true }
      );
    } catch (error) {
      console.error('Error updating buddy request status:', error);
      throw error;
    }
  }

  // Message operations
  async getMessages(user1Id: number, user2Id: number): Promise<Message[]> {
    try {
      const messages = await MessageModel.find({
        $or: [
          { senderId: user1Id, receiverId: user2Id },
          { senderId: user2Id, receiverId: user1Id }
        ]
      }).sort({ createdAt: 1 });
      
      return messages.map(message => this.convertMessageToSchema(message));
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  async createMessage(messageData: InsertMessage): Promise<Message> {
    try {
      const newMessage = new MessageModel(messageData);
      const savedMessage = await newMessage.save();
      return this.convertMessageToSchema(savedMessage);
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  async markMessagesAsRead(messageIds: number[]): Promise<void> {
    try {
      await MessageModel.updateMany(
        { _id: { $in: messageIds } },
        { isRead: true, updatedAt: new Date() }
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  // Helper methods to convert MongoDB documents to schema types
  private convertUserToSchema(user: UserDocument): User {
    return {
      id: parseInt(user._id?.toString() || '0'),
      displayName: user.displayName || '',
      username: user.username || '',
      email: user.email || '',
      profileImageUrl: user.profileImageUrl || null,
      bio: user.bio || null,
      location: user.location || null,
      interests: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private convertEventToSchema(event: EventDocument): Event {
    return {
      id: parseInt(event._id?.toString() || '0'),
      title: event.title || '',
      description: event.description || '',
      category: event.category || '',
      date: event.date || '',
      time: event.time || '',
      venue: event.venue || '',
      location: event.location || '',
      imageUrl: event.imageUrl || '',
      priceRange: event.priceRange || null,
      featured: event.featured || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private convertInterestToSchema(interest: InterestDocument): Interest {
    return {
      id: parseInt(interest._id?.toString() || '0'),
      name: interest.name || '',
      category: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private convertBuddyRequestToSchema(request: BuddyRequestDocument): BuddyRequest {
    return {
      id: parseInt(request._id?.toString() || '0'),
      senderId: 0,
      receiverId: 0,
      eventId: 0,
      message: request.message || null,
      status: request.status || 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private convertMessageToSchema(message: MessageDocument): Message {
    return {
      id: parseInt(message._id?.toString() || '0'),
      senderId: 0,
      receiverId: 0,
      content: message.content || '',
      isRead: message.read || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}