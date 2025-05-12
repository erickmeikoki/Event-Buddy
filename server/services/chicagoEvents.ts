import axios from 'axios';
import { InsertEvent, Event } from '@shared/schema';

// API URL for Chicago Park District Event Permits
const CHICAGO_EVENTS_API_URL = 'https://data.cityofchicago.org/api/views/pk66-w54g/rows.json?accessType=DOWNLOAD';

// Define the expected structure of the Chicago event data
interface ChicagoEventRaw {
  // Based on the API response, the data is an array of arrays
  // The indices are based on the sample data we retrieved
  0: string; // row ID
  1: string; // unique ID
  2: number; // position
  3: number; // timestamp
  4: any; // null
  5: number; // timestamp2
  6: any; // null
  7: string; // empty JSON object
  8: string; // permit holder
  9: string; // empty or '--'
  10: string; // park ID
  11: string; // venue
  12: string; // event date
  13: string; // event date (end)
  14: string; // event type
  15: string; // event title
  16: string; // status
}

// Categories for events based on the event type
const eventCategories: Record<string, string> = {
  'Administrative Reservation': 'Administrative',
  'Permit - Event': 'Event',
  'Permit - Picnic': 'Picnic',
  'Permit - Festival': 'Festival',
  'Permit - Athletic': 'Sports',
  'Permit - Corporate': 'Corporate',
  'Permit - Promotional': 'Promotional',
  'Permit - Wedding': 'Wedding',
  'Permit - Film': 'Film',
  'Permit - Special Event': 'Special Event',
};

// Default image URLs for different event categories
const categoryImages: Record<string, string> = {
  'Administrative': 'https://images.unsplash.com/photo-1491897554428-130a60dd4757?q=80&w=1000',
  'Event': 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1000',
  'Picnic': 'https://images.unsplash.com/photo-1529080589245-1f92f0a5c90c?q=80&w=1000',
  'Festival': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000',
  'Sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1000',
  'Corporate': 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=1000',
  'Promotional': 'https://images.unsplash.com/photo-1563986768711-b3bde3dc821e?q=80&w=1000',
  'Wedding': 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1000',
  'Film': 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000',
  'Special Event': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000',
  'default': 'https://images.unsplash.com/photo-1496337589254-7e19d01cec44?q=80&w=1000',
};

/**
 * Determine the event category based on the event type
 */
function determineCategory(eventType: string): string {
  // Loop through the eventCategories and find a matching key
  for (const [key, value] of Object.entries(eventCategories)) {
    if (eventType.includes(key)) {
      return value;
    }
  }
  return 'Other'; // Default category
}

/**
 * Get an image URL based on the event category
 */
function getCategoryImage(category: string): string {
  return categoryImages[category] || categoryImages['default'];
}

/**
 * Format date to YYYY-MM-DD
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

/**
 * Format time to HH:MM AM/PM
 */
function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Convert a Chicago event to our Event format
 */
function convertChicagoEvent(event: ChicagoEventRaw, index: number): InsertEvent {
  const title = event[15] || 'Chicago Park Event';
  const eventType = event[14] || 'Event';
  const venue = event[11] || 'Chicago Park';
  const date = event[12] ? formatDate(event[12]) : new Date().toISOString().split('T')[0];
  const time = event[12] ? formatTime(event[12]) : '12:00 PM';
  const category = determineCategory(eventType);
  const imageUrl = getCategoryImage(category);
  const permitHolder = event[8] || 'Chicago Park District';
  
  let description = `${eventType} at ${venue}.`;
  if (permitHolder && permitHolder !== '--') {
    description += ` Hosted by ${permitHolder}.`;
  }
  description += ` Event status: ${event[16] || 'Scheduled'}.`;
  
  return {
    title,
    description,
    category,
    venue,
    location: 'Chicago, IL',
    date,
    time,
    imageUrl,
    priceRange: 'Free',
    featured: index < 5, // Feature the first 5 events
  };
}

/**
 * Fetch events from the Chicago Park District API
 */
export async function fetchChicagoEvents(limit: number = 50): Promise<InsertEvent[]> {
  try {
    const response = await axios.get(`${CHICAGO_EVENTS_API_URL}&$limit=${limit}`);
    
    if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
      console.error('Unexpected API response format:', response.data);
      return [];
    }
    
    // Filter out events with status other than 'Approved' or 'Tentative'
    const validEvents = response.data.data.filter((event: ChicagoEventRaw) => 
      event[16] === 'Approved' || event[16] === 'Tentative'
    );
    
    // Sort by date (newest first) and take only what we need
    const sortedEvents = validEvents.sort((a: ChicagoEventRaw, b: ChicagoEventRaw) => {
      const dateA = new Date(a[12] || 0).getTime();
      const dateB = new Date(b[12] || 0).getTime();
      return dateB - dateA;
    });
    
    // Convert to our format and limit to what's requested
    return sortedEvents.slice(0, limit).map(convertChicagoEvent);
  } catch (error) {
    console.error('Error fetching Chicago events:', error);
    return [];
  }
}

/**
 * Fetch featured events from the Chicago Park District API
 */
export async function fetchFeaturedChicagoEvents(limit: number = 5): Promise<InsertEvent[]> {
  const events = await fetchChicagoEvents(20);
  
  // Take the first 'limit' events and mark them as featured
  return events.slice(0, limit).map(event => ({
    ...event,
    featured: true,
  }));
}

/**
 * Find a Chicago event by title (case-insensitive partial match)
 */
export async function findChicagoEventByTitle(title: string): Promise<InsertEvent | null> {
  try {
    // Fetch a larger batch of events to search through
    const events = await fetchChicagoEvents(100);
    
    // Look for a case-insensitive partial match
    const matchedEvent = events.find(event => 
      event.title.toLowerCase().includes(title.toLowerCase())
    );
    
    return matchedEvent || null;
  } catch (error) {
    console.error('Error finding Chicago event by title:', error);
    return null;
  }
}