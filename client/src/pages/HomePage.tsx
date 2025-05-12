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
  "Event",
  "Picnic",
  "Festival",
  "Sports",
  "Corporate",
  "Wedding",
  "Special Event"
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
  const [location, setLocation] = useState("Chicago, IL");
  const [activeCategory, setActiveCategory] = useState("All Events");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isBuddyModalOpen, setIsBuddyModalOpen] = useState(false);

  const [dataSource, setDataSource] = useState<'firebase' | 'chicago'>('chicago');
  
  const { data: eventsData = [], isLoading: isEventsLoading } = useQuery({
    queryKey: ["events", activeCategory, dataSource],
    queryFn: () => fetchEvents(
      activeCategory === "All Events" ? undefined : activeCategory,
      dataSource
    ),
    enabled: true,
    refetchOnWindowFocus: false
  });

  const { data: featuredEventsData = [], isLoading: isFeaturedLoading } = useQuery({
    queryKey: ["featuredEvents", dataSource],
    queryFn: () => fetchFeaturedEvents(dataSource),
    enabled: true,
    refetchOnWindowFocus: false
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
                key={`featured-${event.id || index}`} 
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
                key={`upcoming-${event.id || index}`} 
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
