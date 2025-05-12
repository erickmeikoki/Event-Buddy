import {
  users,
  events,
  interests,
  userInterests,
  buddyRequests,
  messages,
  type User,
  type InsertUser,
  type Event,
  type InsertEvent,
  type Interest,
  type InsertInterest,
  type UserInterest,
  type InsertUserInterest,
  type BuddyRequest,
  type InsertBuddyRequest,
  type Message,
  type InsertMessage
} from "@shared/schema";
import { app, db, collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp, orderBy, limit } from "../client/src/lib/firebase";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByFirebaseUid(uid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User>;

  // Event operations
  getEvent(id: number): Promise<Event | undefined>;
  getEvents(category?: string): Promise<Event[]>;
  getFeaturedEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;

  // Interest operations
  getInterests(): Promise<Interest[]>;
  createInterest(interest: InsertInterest): Promise<Interest>;
  getUserInterests(userId: number): Promise<Interest[]>;
  addUserInterest(userId: number, interestId: number): Promise<void>;
  removeUserInterest(userId: number, interestId: number): Promise<void>;
  
  // Buddy Request operations
  getBuddyRequests(userId: number): Promise<BuddyRequest[]>;
  createBuddyRequest(request: InsertBuddyRequest): Promise<BuddyRequest>;
  updateBuddyRequestStatus(requestId: number, status: string): Promise<void>;
  
  // Message operations
  getMessages(user1Id: number, user2Id: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessagesAsRead(messageIds: number[]): Promise<void>;
}

// Firebase implementation of the storage interface
export class FirebaseStorage implements IStorage {
  private usersCollection = collection(db, "users");
  private eventsCollection = collection(db, "events");
  private interestsCollection = collection(db, "interests");
  private userInterestsCollection = collection(db, "userInterests");
  private buddyRequestsCollection = collection(db, "buddyRequests");
  private messagesCollection = collection(db, "messages");

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    try {
      const q = query(this.usersCollection, where("id", "==", id));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return undefined;
      }
      
      const userData = querySnapshot.docs[0].data();
      return { id, ...userData } as User;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const q = query(this.usersCollection, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return undefined;
      }
      
      const doc = querySnapshot.docs[0];
      return { id: parseInt(doc.id), ...doc.data() } as User;
    } catch (error) {
      console.error("Error getting user by username:", error);
      throw error;
    }
  }

  async getUserByFirebaseUid(uid: string): Promise<User | undefined> {
    try {
      const q = query(this.usersCollection, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return undefined;
      }
      
      const doc = querySnapshot.docs[0];
      return { id: parseInt(doc.id), ...doc.data() } as User;
    } catch (error) {
      console.error("Error getting user by Firebase UID:", error);
      throw error;
    }
  }

  async createUser(userData: InsertUser): Promise<User> {
    try {
      const docRef = await addDoc(this.usersCollection, userData);
      const newUser: User = { id: parseInt(docRef.id), ...userData };
      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    try {
      const userDoc = doc(db, "users", id.toString());
      await updateDoc(userDoc, userData);
      
      const updatedUser = await this.getUser(id);
      if (!updatedUser) {
        throw new Error("User not found after update");
      }
      
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  // Event operations
  async getEvent(id: number): Promise<Event | undefined> {
    try {
      const eventDoc = await getDoc(doc(db, "events", id.toString()));
      
      if (!eventDoc.exists()) {
        return undefined;
      }
      
      return { id, ...eventDoc.data() } as Event;
    } catch (error) {
      console.error("Error getting event:", error);
      throw error;
    }
  }

  async getEvents(category?: string): Promise<Event[]> {
    try {
      let eventsQuery;
      
      if (category) {
        eventsQuery = query(this.eventsCollection, where("category", "==", category));
      } else {
        eventsQuery = this.eventsCollection;
      }
      
      const querySnapshot = await getDocs(eventsQuery);
      return querySnapshot.docs.map(doc => ({
        id: parseInt(doc.id),
        ...doc.data()
      } as Event));
    } catch (error) {
      console.error("Error getting events:", error);
      throw error;
    }
  }

  async getFeaturedEvents(): Promise<Event[]> {
    try {
      const featuredQuery = query(this.eventsCollection, where("featured", "==", true));
      const querySnapshot = await getDocs(featuredQuery);
      
      return querySnapshot.docs.map(doc => ({
        id: parseInt(doc.id),
        ...doc.data()
      } as Event));
    } catch (error) {
      console.error("Error getting featured events:", error);
      throw error;
    }
  }

  async createEvent(eventData: InsertEvent): Promise<Event> {
    try {
      const docRef = await addDoc(this.eventsCollection, eventData);
      const newEvent: Event = { id: parseInt(docRef.id), ...eventData };
      return newEvent;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  // Interest operations
  async getInterests(): Promise<Interest[]> {
    try {
      const querySnapshot = await getDocs(this.interestsCollection);
      return querySnapshot.docs.map(doc => ({
        id: parseInt(doc.id),
        ...doc.data()
      } as Interest));
    } catch (error) {
      console.error("Error getting interests:", error);
      throw error;
    }
  }

  async createInterest(interestData: InsertInterest): Promise<Interest> {
    try {
      const docRef = await addDoc(this.interestsCollection, interestData);
      const newInterest: Interest = { id: parseInt(docRef.id), ...interestData };
      return newInterest;
    } catch (error) {
      console.error("Error creating interest:", error);
      throw error;
    }
  }

  async getUserInterests(userId: number): Promise<Interest[]> {
    try {
      const userInterestsQuery = query(
        this.userInterestsCollection,
        where("userId", "==", userId)
      );
      
      const querySnapshot = await getDocs(userInterestsQuery);
      const interestIds = querySnapshot.docs.map(doc => doc.data().interestId);
      
      if (interestIds.length === 0) {
        return [];
      }
      
      const interests: Interest[] = [];
      
      for (const interestId of interestIds) {
        const interestDoc = await getDoc(doc(db, "interests", interestId.toString()));
        
        if (interestDoc.exists()) {
          interests.push({
            id: parseInt(interestDoc.id),
            ...interestDoc.data()
          } as Interest);
        }
      }
      
      return interests;
    } catch (error) {
      console.error("Error getting user interests:", error);
      throw error;
    }
  }

  async addUserInterest(userId: number, interestId: number): Promise<void> {
    try {
      await addDoc(this.userInterestsCollection, {
        userId,
        interestId,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error adding user interest:", error);
      throw error;
    }
  }

  async removeUserInterest(userId: number, interestId: number): Promise<void> {
    try {
      const q = query(
        this.userInterestsCollection,
        where("userId", "==", userId),
        where("interestId", "==", interestId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error("User interest not found");
      }
      
      await deleteDoc(doc(db, "userInterests", querySnapshot.docs[0].id));
    } catch (error) {
      console.error("Error removing user interest:", error);
      throw error;
    }
  }

  // Buddy Request operations
  async getBuddyRequests(userId: number): Promise<BuddyRequest[]> {
    try {
      const q = query(
        this.buddyRequestsCollection,
        where("receiverId", "==", userId)
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: parseInt(doc.id),
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      } as BuddyRequest));
    } catch (error) {
      console.error("Error getting buddy requests:", error);
      throw error;
    }
  }

  async createBuddyRequest(requestData: InsertBuddyRequest): Promise<BuddyRequest> {
    try {
      const requestDataWithTimestamp = {
        ...requestData,
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(this.buddyRequestsCollection, requestDataWithTimestamp);
      
      const newRequest: BuddyRequest = {
        id: parseInt(docRef.id),
        ...requestData,
        createdAt: new Date()
      };
      
      return newRequest;
    } catch (error) {
      console.error("Error creating buddy request:", error);
      throw error;
    }
  }

  async updateBuddyRequestStatus(requestId: number, status: string): Promise<void> {
    try {
      const requestDoc = doc(db, "buddyRequests", requestId.toString());
      await updateDoc(requestDoc, { status });
    } catch (error) {
      console.error("Error updating buddy request status:", error);
      throw error;
    }
  }

  // Message operations
  async getMessages(user1Id: number, user2Id: number): Promise<Message[]> {
    try {
      // Get messages where user1 is sender and user2 is receiver
      const q1 = query(
        this.messagesCollection,
        where("senderId", "==", user1Id),
        where("receiverId", "==", user2Id)
      );
      
      // Get messages where user2 is sender and user1 is receiver
      const q2 = query(
        this.messagesCollection,
        where("senderId", "==", user2Id),
        where("receiverId", "==", user1Id)
      );
      
      const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);
      
      const messages1 = snapshot1.docs.map(doc => ({
        id: parseInt(doc.id),
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      } as Message));
      
      const messages2 = snapshot2.docs.map(doc => ({
        id: parseInt(doc.id),
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      } as Message));
      
      // Combine and sort by createdAt
      return [...messages1, ...messages2].sort((a, b) => 
        a.createdAt.getTime() - b.createdAt.getTime()
      );
    } catch (error) {
      console.error("Error getting messages:", error);
      throw error;
    }
  }

  async createMessage(messageData: InsertMessage): Promise<Message> {
    try {
      const messageDataWithTimestamp = {
        ...messageData,
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(this.messagesCollection, messageDataWithTimestamp);
      
      const newMessage: Message = {
        id: parseInt(docRef.id),
        ...messageData,
        createdAt: new Date()
      };
      
      return newMessage;
    } catch (error) {
      console.error("Error creating message:", error);
      throw error;
    }
  }

  async markMessagesAsRead(messageIds: number[]): Promise<void> {
    try {
      const updates = messageIds.map(id => 
        updateDoc(doc(db, "messages", id.toString()), { read: true })
      );
      
      await Promise.all(updates);
    } catch (error) {
      console.error("Error marking messages as read:", error);
      throw error;
    }
  }
}

// MongoDB storage implementation is in mongoDbStorage.ts
import { MongoDBStorage } from './mongoDbStorage';

// In-memory storage implementation for development and testing
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private interestsMap: Map<number, Interest>;
  private userInterestsMap: Map<number, number[]>;
  private buddyRequestsMap: Map<number, BuddyRequest>;
  private messagesMap: Map<number, Message>;
  
  private userId: number = 1;
  private eventId: number = 1;
  private interestId: number = 1;
  private buddyRequestId: number = 1;
  private messageId: number = 1;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.interestsMap = new Map();
    this.userInterestsMap = new Map();
    this.buddyRequestsMap = new Map();
    this.messagesMap = new Map();
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample users
    const user1: User = {
      id: this.userId++,
      uid: "user1",
      username: "alexmorgan",
      displayName: "Alex Morgan",
      email: "alex@example.com",
      bio: "Passionate about music, concerts, and meeting new people. Always looking for event buddies!",
      profileImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&h=120",
      location: "San Francisco, CA"
    };
    this.users.set(user1.id, user1);

    const user2: User = {
      id: this.userId++,
      uid: "user2",
      username: "michaelr",
      displayName: "Michael R.",
      email: "michael@example.com",
      bio: "Concert Enthusiast",
      profileImageUrl: "",
      location: "San Francisco, CA"
    };
    this.users.set(user2.id, user2);

    const user3: User = {
      id: this.userId++,
      uid: "user3",
      username: "sophiat",
      displayName: "Sophia T.",
      email: "sophia@example.com",
      bio: "Arts & Culture Fan",
      profileImageUrl: "",
      location: "San Francisco, CA"
    };
    this.users.set(user3.id, user3);

    // Sample events
    const event1: Event = {
      id: this.eventId++,
      title: "Taylor Swift - The Eras Tour",
      description: "Experience Taylor Swift's record-breaking Eras Tour, featuring music from her entire catalog. This once-in-a-lifetime concert experience has been selling out stadiums nationwide with stunning visuals, costume changes, and a 3+ hour setlist spanning her incredible career.",
      category: "Concerts",
      venue: "Levi's Stadium",
      location: "Santa Clara, CA",
      date: "Sat, Aug 5",
      time: "7:00 PM",
      priceRange: "$120 - $450",
      imageUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      featured: true
    };
    this.events.set(event1.id, event1);

    const event2: Event = {
      id: this.eventId++,
      title: "SF Giants vs LA Dodgers",
      description: "Don't miss this classic baseball rivalry as the San Francisco Giants take on the Los Angeles Dodgers at Oracle Park. Come enjoy America's favorite pastime with stunning views of the San Francisco Bay!",
      category: "Sports",
      venue: "Oracle Park",
      location: "San Francisco, CA",
      date: "Sun, Jul 23",
      time: "1:05 PM",
      priceRange: "$45 - $150",
      imageUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      featured: true
    };
    this.events.set(event2.id, event2);

    const event3: Event = {
      id: this.eventId++,
      title: "SF Food Festival",
      description: "Sample the best food San Francisco has to offer at the annual SF Food Festival. With over 50 local vendors, live music, and cooking demonstrations, this is a food lover's paradise.",
      category: "Food & Drink",
      venue: "Marina Green",
      location: "San Francisco, CA",
      date: "Sat, Jul 29",
      time: "11:00 AM",
      priceRange: "$25",
      imageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      featured: true
    };
    this.events.set(event3.id, event3);

    const event4: Event = {
      id: this.eventId++,
      title: "Indie Night at The Chapel",
      description: "Join us for a night of indie music featuring local bands and emerging artists. The Chapel provides an intimate setting for experiencing new music in San Francisco's vibrant Mission District.",
      category: "Concerts",
      venue: "The Chapel",
      location: "San Francisco, CA",
      date: "Fri, Jul 28",
      time: "8:00 PM",
      priceRange: "$25 - $35",
      imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      featured: false
    };
    this.events.set(event4.id, event4);

    const event5: Event = {
      id: this.eventId++,
      title: "Modern Art Exhibition",
      description: "Explore the boundaries of contemporary art at this special exhibition featuring works from both established and emerging artists from around the world.",
      category: "Arts",
      venue: "SFMOMA",
      location: "San Francisco, CA",
      date: "Sat-Sun, Jul 22-30",
      time: "All Day",
      priceRange: "$20",
      imageUrl: "https://images.unsplash.com/photo-1594571302762-8b11a9a6d886?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      featured: false
    };
    this.events.set(event5.id, event5);

    const event6: Event = {
      id: this.eventId++,
      title: "Saturday Night Club",
      description: "Dance the night away with our resident DJs spinning the hottest tracks at San Francisco's premier nightclub. VIP tables and bottle service available.",
      category: "Nightlife",
      venue: "Temple Nightclub",
      location: "San Francisco, CA",
      date: "Sat, Jul 22",
      time: "10:00 PM",
      priceRange: "$30",
      imageUrl: "https://images.unsplash.com/photo-1571185408429-749efca15e39?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      featured: false
    };
    this.events.set(event6.id, event6);

    // Sample interests
    const interests = [
      "Rock", "Jazz", "Indie", "Pop", "Classical",
      "Baseball", "Basketball", "Football", "Soccer", "Tennis",
      "Art", "Museums", "Theater", "Photography", "Literature",
      "Restaurants", "Craft Beer", "Wine Tasting", "Cooking", "Cafes",
      "Clubs", "Bars", "Dancing", "Live Music", "DJs"
    ];

    interests.forEach(name => {
      const interest: Interest = {
        id: this.interestId++,
        name
      };
      this.interestsMap.set(interest.id, interest);
    });

    // Sample user interests
    this.userInterestsMap.set(user1.id, [1, 2, 3, 11, 12]);
    this.userInterestsMap.set(user2.id, [1, 2, 3]);
    this.userInterestsMap.set(user3.id, [11, 12, 13]);

    // Sample buddy requests
    const request1: BuddyRequest = {
      id: this.buddyRequestId++,
      requesterId: user2.id,
      receiverId: user1.id,
      eventId: event1.id,
      status: "pending",
      message: "I'm a huge Taylor Swift fan, would love to go to the concert with you!",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    };
    this.buddyRequestsMap.set(request1.id, request1);

    // Sample messages
    const message1: Message = {
      id: this.messageId++,
      senderId: user2.id,
      receiverId: user1.id,
      content: "Hey there! I saw you're interested in the Taylor Swift concert.",
      read: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    };
    this.messagesMap.set(message1.id, message1);

    const message2: Message = {
      id: this.messageId++,
      senderId: user1.id,
      receiverId: user2.id,
      content: "Yes! I'm so excited about it. Are you planning to go?",
      read: true,
      createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000) // 23 hours ago
    };
    this.messagesMap.set(message2.id, message2);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async getUserByFirebaseUid(uid: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.uid === uid) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = { id, ...userData };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Event operations
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getEvents(category?: string): Promise<Event[]> {
    const allEvents = Array.from(this.events.values());
    
    if (category) {
      return allEvents.filter(event => event.category === category);
    }
    
    return allEvents;
  }

  async getFeaturedEvents(): Promise<Event[]> {
    const allEvents = Array.from(this.events.values());
    return allEvents.filter(event => event.featured);
  }

  async createEvent(eventData: InsertEvent): Promise<Event> {
    const id = this.eventId++;
    const newEvent: Event = { id, ...eventData };
    this.events.set(id, newEvent);
    return newEvent;
  }

  // Interest operations
  async getInterests(): Promise<Interest[]> {
    return Array.from(this.interestsMap.values());
  }

  async createInterest(interestData: InsertInterest): Promise<Interest> {
    const id = this.interestId++;
    const newInterest: Interest = { id, ...interestData };
    this.interestsMap.set(id, newInterest);
    return newInterest;
  }

  async getUserInterests(userId: number): Promise<Interest[]> {
    const interestIds = this.userInterestsMap.get(userId) || [];
    return interestIds.map(id => this.interestsMap.get(id)!).filter(Boolean);
  }

  async addUserInterest(userId: number, interestId: number): Promise<void> {
    const userInterests = this.userInterestsMap.get(userId) || [];
    
    if (!userInterests.includes(interestId)) {
      userInterests.push(interestId);
      this.userInterestsMap.set(userId, userInterests);
    }
  }

  async removeUserInterest(userId: number, interestId: number): Promise<void> {
    const userInterests = this.userInterestsMap.get(userId) || [];
    const updatedInterests = userInterests.filter(id => id !== interestId);
    this.userInterestsMap.set(userId, updatedInterests);
  }

  // Buddy Request operations
  async getBuddyRequests(userId: number): Promise<BuddyRequest[]> {
    const requests = Array.from(this.buddyRequestsMap.values());
    return requests.filter(request => request.receiverId === userId);
  }

  async createBuddyRequest(requestData: InsertBuddyRequest): Promise<BuddyRequest> {
    const id = this.buddyRequestId++;
    const newRequest: BuddyRequest = { 
      id, 
      ...requestData, 
      createdAt: new Date() 
    };
    this.buddyRequestsMap.set(id, newRequest);
    return newRequest;
  }

  async updateBuddyRequestStatus(requestId: number, status: string): Promise<void> {
    const request = this.buddyRequestsMap.get(requestId);
    
    if (!request) {
      throw new Error("Buddy request not found");
    }
    
    request.status = status;
    this.buddyRequestsMap.set(requestId, request);
  }

  // Message operations
  async getMessages(user1Id: number, user2Id: number): Promise<Message[]> {
    const messages = Array.from(this.messagesMap.values());
    
    return messages.filter(message => 
      (message.senderId === user1Id && message.receiverId === user2Id) ||
      (message.senderId === user2Id && message.receiverId === user1Id)
    ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createMessage(messageData: InsertMessage): Promise<Message> {
    const id = this.messageId++;
    const newMessage: Message = { 
      id, 
      ...messageData, 
      createdAt: new Date() 
    };
    this.messagesMap.set(id, newMessage);
    return newMessage;
  }

  async markMessagesAsRead(messageIds: number[]): Promise<void> {
    messageIds.forEach(id => {
      const message = this.messagesMap.get(id);
      
      if (message) {
        message.read = true;
        this.messagesMap.set(id, message);
      }
    });
  }
}

// Export the storage interface implementation
// Choose the storage implementation to use
// For production, use MongoDB storage
export const storage = new MongoDBStorage();

// For development or testing, you can use in-memory storage
// export const storage = new MemStorage();
