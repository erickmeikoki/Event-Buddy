import { Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CalendarIcon, 
  MapPinIcon, 
  UsersIcon 
} from "lucide-react";
import { Event } from "@shared/schema";

interface EventCardProps {
  event: Event;
  onFindBuddies: (eventId: number) => void;
}

export default function EventCard({ event, onFindBuddies }: EventCardProps) {
  return (
    <Card className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-48 object-cover" 
        />
        <div className="absolute top-3 right-3 bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center">
          <UsersIcon className="h-3 w-3 mr-1" />
          <span>24 buddies looking</span>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <Link href={`/event/${event.id}`}>
              <a className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
                {event.title}
              </a>
            </Link>
            <p className="text-gray-500 text-sm flex items-center">
              <MapPinIcon className="h-3 w-3 mr-1" /> 
              {event.venue} • {event.location.split(',')[0]}
            </p>
          </div>
          <Badge variant="outline" className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded font-medium">
            {event.category}
          </Badge>
        </div>
        
        <div className="mt-3 flex items-center text-sm text-gray-700">
          <CalendarIcon className="h-3 w-3 mr-1" /> 
          {event.date} • {event.time}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="font-semibold">{event.priceRange}</span>
          <Button 
            onClick={(e) => {
              e.preventDefault();
              onFindBuddies(event.id);
            }}
            className="bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            Find Buddies
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
