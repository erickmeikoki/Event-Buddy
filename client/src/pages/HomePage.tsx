import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents, fetchFeaturedEvents } from "@/lib/queryUtils";
import EventCard from "@/components/EventCard";
import CategoryFilter from "@/components/CategoryFilter";
import LocationSelector from "@/components/LocationSelector";
import UserCard from "@/components/UserCard";
import BuddyMatchModal from "@/components/BuddyMatchModal";
import EventDetailModal from "@/components/EventDetailModal";
import { Event } from "@shared/schema";

const CATEGORIES = [
  "All Events",
  "Concerts",
  "Sports",
  "Food & Drink",
  "Arts",
  "Nightlife"
];

// Sample matched users for demonstration
const SAMPLE_MATCHES = [
  {
    id: 1,
    displayName: "Michael R.",
    bio: "Concert Enthusiast",
    interests: ["Rock", "Jazz", "Indie"],
    matchPercentage: 94
  },
  {
    id: 2,
    displayName: "Sophia T.",
    bio: "Arts & Culture Fan",
    interests: ["Art", "Music", "Theater"],
    matchPercentage: 88
  },
  {
    id: 3,
    displayName: "David K.",
    bio: "Sports Fan",
    interests: ["Music", "Concerts", "Pop"],
    matchPercentage: 85
  }
];

// Sample buddy recommendations
const SAMPLE_RECOMMENDATIONS = [
  {
    id: 1,
    displayName: "Michael R.",
    bio: "Concert Enthusiast",
    interests: ["Rock", "Jazz", "Indie"],
    matchPercentage: 94
  },
  {
    id: 2,
    displayName: "Sophia T.",
    bio: "Arts & Culture Fan",
    interests: ["Art", "Museums", "Theater"],
    matchPercentage: 88
  },
  {
    id: 3,
    displayName: "David K.",
    bio: "Sports Fan",
    interests: ["Baseball", "Basketball", "Football"],
    matchPercentage: 85
  },
  {
    id: 4,
    displayName: "Jamie L.",
    bio: "Nightlife Enthusiast",
    interests: ["Clubs", "Bars", "Dancing"],
    matchPercentage: 82
  }
];

export default function HomePage() {
  const [location, setLocation] = useState("San Francisco, CA");
  const [activeCategory, setActiveCategory] = useState("All Events");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isBuddyModalOpen, setIsBuddyModalOpen] = useState(false);

  // Sample Events Data
  const mockEvents = [
    {
      id: 1,
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
    },
    {
      id: 2,
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
    },
    {
      id: 3,
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
    },
    {
      id: 4,
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
    },
    {
      id: 5,
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
    },
    {
      id: 6,
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
    }
  ];

  const { data: eventsData = mockEvents, isLoading: isEventsLoading } = useQuery({
    queryKey: ["events", activeCategory],
    queryFn: () => fetchEvents(activeCategory === "All Events" ? undefined : activeCategory),
    enabled: false // Disable real fetching for demo
  });

  const { data: featuredEventsData = mockEvents.filter(e => e.featured), isLoading: isFeaturedLoading } = useQuery({
    queryKey: ["featuredEvents"],
    queryFn: fetchFeaturedEvents,
    enabled: false // Disable real fetching for demo
  });

  const upcomingEvents = eventsData.filter(e => !e.featured).slice(0, 3);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleFindBuddies = (eventId: number) => {
    const event = [...featuredEventsData, ...upcomingEvents].find(e => e.id === eventId) || null;
    setSelectedEvent(event);
    setIsBuddyModalOpen(true);
  };

  const handleSendBuddyRequest = (eventId: number, message: string, userIds: number[]) => {
    console.log(`Sending buddy requests for event ${eventId} to users ${userIds.join(", ")}`);
    console.log(`Message: ${message}`);
    // In a real app, this would send a request to the server
  };

  const handleConnectUser = (userId: number) => {
    console.log(`Connecting with user ${userId}`);
    // In a real app, this would send a connection request
  };

  return (
    <div className="p-4 lg:p-8 pb-20 lg:pb-8">
      <h2 className="text-2xl font-bold mb-6 lg:mb-8">Discover Events</h2>
      
      <LocationSelector location={location} onLocationChange={handleLocationChange} />
      
      <CategoryFilter 
        categories={CATEGORIES} 
        activeCategory={activeCategory} 
        onSelectCategory={handleCategoryChange} 
      />
      
      {/* Featured Events */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Featured Events</h3>
          <a href="#" className="text-primary text-sm font-medium">View All</a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isFeaturedLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-[380px] bg-gray-200 animate-pulse rounded-xl"></div>
            ))
          ) : (
            featuredEventsData.map((event, index) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onFindBuddies={handleFindBuddies}
                index={index} 
              />
            ))
          )}
        </div>
      </div>
      
      {/* Upcoming Events */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Upcoming Events</h3>
          <a href="#" className="text-primary text-sm font-medium">View All</a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isEventsLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-[380px] bg-gray-200 animate-pulse rounded-xl"></div>
            ))
          ) : (
            upcomingEvents.map((event, index) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onFindBuddies={handleFindBuddies}
                index={index + 3} // Continue index count from featured events
              />
            ))
          )}
        </div>
      </div>
      
      {/* Buddy Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">People With Similar Interests</h3>
          <a href="#" className="text-primary text-sm font-medium">View All</a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SAMPLE_RECOMMENDATIONS.map((user, index) => (
            <UserCard 
              key={user.id} 
              user={user} 
              onConnect={handleConnectUser}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal 
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        event={selectedEvent}
        onFindBuddies={handleFindBuddies}
      />

      {/* Buddy Match Modal */}
      <BuddyMatchModal 
        isOpen={isBuddyModalOpen}
        onClose={() => setIsBuddyModalOpen(false)}
        event={selectedEvent}
        matches={SAMPLE_MATCHES}
        onSendRequest={handleSendBuddyRequest}
      />
    </div>
  );
}
