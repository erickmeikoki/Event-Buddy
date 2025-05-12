import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchEventById } from "@/lib/queryUtils";
import { ChevronLeft, MapPin, Calendar, User as UserIcon, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BuddyMatchModal from "@/components/BuddyMatchModal";
import { Event } from "@shared/schema";

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

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [isBuddyModalOpen, setIsBuddyModalOpen] = useState(false);
  
  const eventId = parseInt(params.id);
  
  // Sample event data for demonstration
  const mockEvent: Event = {
    id: eventId,
    title: "Taylor Swift - The Eras Tour",
    description: "Experience Taylor Swift's record-breaking Eras Tour, featuring music from her entire catalog. This once-in-a-lifetime concert experience has been selling out stadiums nationwide with stunning visuals, costume changes, and a 3+ hour setlist spanning her incredible career.",
    category: "Concerts",
    venue: "Levi's Stadium",
    location: "Santa Clara, CA",
    date: "Saturday, August 5, 2023",
    time: "7:00 PM",
    priceRange: "$120 - $450",
    imageUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
    featured: true
  };

  const { data: event = mockEvent, isLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => fetchEventById(eventId),
    enabled: false // Disable real fetching for demo
  });

  const handleFindBuddies = () => {
    setIsBuddyModalOpen(true);
  };

  const handleSendBuddyRequest = (eventId: number, message: string, userIds: number[]) => {
    console.log(`Sending buddy requests for event ${eventId} to users ${userIds.join(", ")}`);
    console.log(`Message: ${message}`);
    // In a real app, this would send a request to the server
  };

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold text-center">Event not found</h1>
      </div>
    );
  }

  return (
    <div className="pb-20 lg:pb-8">
      {/* Event image */}
      <div className="relative h-64 md:h-80 w-full">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover" 
        />
        <button 
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
          <Share2 className="h-5 w-5" />
        </button>
      </div>
      
      {/* Event details */}
      <div className="p-4 lg:p-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold">{event.title}</h1>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{event.venue}, {event.location}</span>
            </div>
          </div>
          <Badge variant="outline" className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full">
            {event.category}
          </Badge>
        </div>
        
        <div className="flex items-center text-gray-600 mb-6">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{event.date} • {event.time}</span>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <h2 className="font-semibold mb-2">About This Event</h2>
          <p className="text-gray-700">{event.description}</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <h2 className="font-semibold mb-2">Price Range</h2>
          <p className="text-gray-700">{event.priceRange}</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <h2 className="font-semibold mb-4">Looking for Buddies (24)</h2>
          
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            {/* Sample user profiles */}
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-1">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <UserIcon className="h-6 w-6 text-gray-500" />
                </div>
                <span className="text-xs font-medium whitespace-nowrap">User {index + 1}</span>
              </div>
            ))}
            <div className="flex flex-col items-center space-y-1">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 font-semibold">+18</span>
              </div>
              <span className="text-xs font-medium whitespace-nowrap">More</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Button variant="outline" className="flex-1">
            Add to Calendar
          </Button>
          <Button className="flex-1" onClick={handleFindBuddies}>
            Find Buddies
          </Button>
        </div>
      </div>
      
      {/* Buddy Match Modal */}
      <BuddyMatchModal 
        isOpen={isBuddyModalOpen}
        onClose={() => setIsBuddyModalOpen(false)}
        event={event}
        matches={SAMPLE_MATCHES}
        onSendRequest={handleSendBuddyRequest}
      />
    </div>
  );
}
