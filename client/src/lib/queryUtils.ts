import { db, collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp } from './firebase';
import { Event, User, Message, BuddyRequest, Interest } from '@shared/schema';

// Event related queries
export const fetchEvents = async (category?: string): Promise<Event[]> => {
  try {
    let eventsQuery;
    
    if (category && category !== 'All Events') {
      eventsQuery = query(collection(db, 'events'), where('category', '==', category));
    } else {
      eventsQuery = collection(db, 'events');
    }
    
    const snapshot = await getDocs(eventsQuery);
    return snapshot.docs.map(doc => ({
      id: Number(doc.id),
      ...doc.data()
    } as Event));
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const fetchEventById = async (eventId: number): Promise<Event | null> => {
  try {
    const eventDoc = await getDoc(doc(db, 'events', eventId.toString()));
    
    if (eventDoc.exists()) {
      return {
        id: Number(eventDoc.id),
        ...eventDoc.data()
      } as Event;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    throw error;
  }
};

export const fetchFeaturedEvents = async (): Promise<Event[]> => {
  try {
    const eventsQuery = query(collection(db, 'events'), where('featured', '==', true));
    const snapshot = await getDocs(eventsQuery);
    
    return snapshot.docs.map(doc => ({
      id: Number(doc.id),
      ...doc.data()
    } as Event));
  } catch (error) {
    console.error('Error fetching featured events:', error);
    throw error;
  }
};

// User related queries
export const fetchUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      return {
        id: Number(userDoc.id),
        ...userDoc.data()
      } as User;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const fetchUsersByInterests = async (interests: string[]): Promise<User[]> => {
  try {
    // This is a simplified approach - in a real app you'd need to handle this more efficiently
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    const users = snapshot.docs.map(doc => ({
      id: Number(doc.id),
      ...doc.data()
    } as User));
    
    // Filter users based on shared interests
    // This would typically be done in a more sophisticated way in a production app
    return users;
  } catch (error) {
    console.error('Error fetching users by interests:', error);
    throw error;
  }
};

// Interests
export const fetchAllInterests = async (): Promise<Interest[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'interests'));
    
    return snapshot.docs.map(doc => ({
      id: Number(doc.id),
      ...doc.data()
    } as Interest));
  } catch (error) {
    console.error('Error fetching interests:', error);
    throw error;
  }
};

// Buddy requests
export const sendBuddyRequest = async (requestData: Omit<BuddyRequest, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'buddyRequests'), {
      ...requestData,
      createdAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error sending buddy request:', error);
    throw error;
  }
};

export const fetchBuddyRequests = async (userId: number): Promise<BuddyRequest[]> => {
  try {
    const requestsQuery = query(
      collection(db, 'buddyRequests'),
      where('receiverId', '==', userId)
    );
    
    const snapshot = await getDocs(requestsQuery);
    
    return snapshot.docs.map(doc => ({
      id: Number(doc.id),
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    } as BuddyRequest));
  } catch (error) {
    console.error('Error fetching buddy requests:', error);
    throw error;
  }
};

export const updateBuddyRequestStatus = async (requestId: number, status: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'buddyRequests', requestId.toString()), {
      status
    });
  } catch (error) {
    console.error('Error updating buddy request status:', error);
    throw error;
  }
};

// Messages
export const sendMessage = async (messageData: Omit<Message, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'messages'), {
      ...messageData,
      createdAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const fetchMessages = async (userId1: number, userId2: number): Promise<Message[]> => {
  try {
    // Get messages where the current user is either the sender or receiver
    const query1 = query(
      collection(db, 'messages'),
      where('senderId', '==', userId1),
      where('receiverId', '==', userId2)
    );
    
    const query2 = query(
      collection(db, 'messages'),
      where('senderId', '==', userId2),
      where('receiverId', '==', userId1)
    );
    
    const [snapshot1, snapshot2] = await Promise.all([
      getDocs(query1),
      getDocs(query2)
    ]);
    
    const messages1 = snapshot1.docs.map(doc => ({
      id: Number(doc.id),
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    } as Message));
    
    const messages2 = snapshot2.docs.map(doc => ({
      id: Number(doc.id),
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    } as Message));
    
    // Combine and sort by createdAt
    return [...messages1, ...messages2].sort((a, b) => 
      a.createdAt.getTime() - b.createdAt.getTime()
    );
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const markMessagesAsRead = async (messageIds: number[]): Promise<void> => {
  try {
    const updates = messageIds.map(id => 
      updateDoc(doc(db, 'messages', id.toString()), { read: true })
    );
    
    await Promise.all(updates);
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};
