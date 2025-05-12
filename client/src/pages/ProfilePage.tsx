import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { auth, db, doc, getDoc, collection, query, where, getDocs } from "@/lib/firebase";
import { 
  User, 
  Edit, 
  Settings, 
  Calendar, 
  MapPin, 
  Mail, 
  MessageSquare 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import EventCard from "@/components/EventCard";
import BuddyMatchModal from "@/components/BuddyMatchModal";
import { Event } from "@shared/schema";

// Sample user profile data
const SAMPLE_USER = {
  id: 1,
  displayName: "Alex Morgan",
  username: "alexmorgan",
  bio: "Passionate about music, concerts, and meeting new people. Always looking for event buddies!",
  location: "San Francisco, CA",
  email: "alex@example.com",
  profileImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&h=120",
  interests: ["Concerts", "Sports", "Food & Drink", "Arts", "Indie Music", "Rock", "Jazz"]
};

// Sample event data
const SAMPLE_EVENTS = [
  {
    id: 1,
    title: "Taylor Swift - The Eras Tour",
    description: "Experience Taylor Swift's record-breaking Eras Tour, featuring music from her entire catalog.",
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
    description: "Don't miss this classic baseball rivalry as the San Francisco Giants take on the Los Angeles Dodgers.",
    category: "Sports",
    venue: "Oracle Park",
    location: "San Francisco, CA",
    date: "Sun, Jul 23",
    time: "1:05 PM",
    priceRange: "$45 - $150",
    imageUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
    featured: false
  }
];

// Sample matched users for buddy modal
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

export default function ProfilePage() {
  const params = useParams<{ id?: string }>();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isBuddyModalOpen, setIsBuddyModalOpen] = useState(false);
  const isCurrentUser = !params.id || params.id === auth.currentUser?.uid;

  // In a real app, use the ID to fetch the user profile
  const { data: user = SAMPLE_USER, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", params.id || "current"],
    queryFn: async () => {
      // This would fetch the actual user profile
      return SAMPLE_USER;
    },
    enabled: false // Disable real fetching for demo
  });

  // Fetch upcoming events
  const { data: upcomingEvents = SAMPLE_EVENTS, isLoading: isEventsLoading } = useQuery({
    queryKey: ["userEvents", user.id],
    queryFn: async () => {
      // This would fetch the user's upcoming events
      return SAMPLE_EVENTS;
    },
    enabled: false // Disable real fetching for demo
  });

  // Fetch past events
  const { data: pastEvents = [], isLoading: isPastEventsLoading } = useQuery({
    queryKey: ["userPastEvents", user.id],
    queryFn: async () => {
      // This would fetch the user's past events
      return [];
    },
    enabled: false // Disable real fetching for demo
  });

  const handleFindBuddies = (eventId: number) => {
    const event = upcomingEvents.find(e => e.id === eventId) || null;
    setSelectedEvent(event);
    setIsBuddyModalOpen(true);
  };

  const handleSendBuddyRequest = (eventId: number, message: string, userIds: number[]) => {
    console.log(`Sending buddy requests for event ${eventId} to users ${userIds.join(", ")}`);
    console.log(`Message: ${message}`);
    // In a real app, this would send a request to the server
  };

  if (isUserLoading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 pb-20 lg:pb-8">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0">
              {user.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt={`${user.displayName}'s profile`}
                  className="w-24 h-24 rounded-full object-cover" 
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-10 w-10 text-gray-500" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{user.displayName}</h1>
                  <p className="text-gray-500">@{user.username}</p>
                </div>
                
                {isCurrentUser ? (
                  <div className="mt-4 md:mt-0 flex space-x-2">
                    <Button variant="outline" className="flex items-center">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4 md:mt-0 flex space-x-2">
                    <Button variant="outline" className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                    <Button className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>5 Upcoming Events</span>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-gray-700">{user.bio}</p>
              </div>
            </div>
          </div>
          
          {/* Interests */}
          <div className="mt-6">
            <h2 className="font-semibold mb-3">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest, index) => (
                <Badge key={index} variant="outline" className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs for events */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
          <TabsTrigger value="buddies">Event Buddies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isEventsLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-[380px] bg-gray-200 animate-pulse rounded-xl"></div>
              ))
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onFindBuddies={handleFindBuddies} 
                />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-medium mb-2">No Upcoming Events</h3>
                  <p className="text-gray-600 mb-4">You don't have any upcoming events yet.</p>
                  <Button>Browse Events</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="past">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isPastEventsLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-[380px] bg-gray-200 animate-pulse rounded-xl"></div>
              ))
            ) : pastEvents.length > 0 ? (
              pastEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onFindBuddies={handleFindBuddies} 
                />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-medium mb-2">No Past Events</h3>
                  <p className="text-gray-600">Your attended events will appear here.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="buddies">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SAMPLE_MATCHES.map((match) => (
              <Card key={match.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                      <span className="text-gray-600 font-semibold">
                        {match.displayName.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-semibold text-base">{match.displayName}</h4>
                    <p className="text-gray-500 text-sm">{match.bio}</p>
                    <Badge variant="outline" className="mt-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {match.matchPercentage}% Match
                    </Badge>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap justify-center gap-1">
                    {match.interests.map((interest, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    className="mt-4 w-full"
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
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
