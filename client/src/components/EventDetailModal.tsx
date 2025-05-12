import { useRef, useEffect } from "react";
import { X, MapPin, Calendar, User as UserIcon } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Event } from "@shared/schema";

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onFindBuddies: (eventId: number) => void;
}

export default function EventDetailModal({ 
  isOpen, 
  onClose, 
  event, 
  onFindBuddies 
}: EventDetailModalProps) {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-xl overflow-hidden max-w-lg w-full max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="flex items-center justify-between p-4 border-b">
          <DialogTitle className="font-semibold text-lg">Event Details</DialogTitle>
          <DialogClose className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </DialogClose>
        </DialogHeader>
        <DialogDescription className="sr-only">Detailed information about the event, including date, location, and description.</DialogDescription>
        
        <div className="overflow-y-auto flex-1 p-0">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-60 object-cover"
          />
          
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-bold text-xl mb-1">{event.title}</h2>
                <p className="text-gray-600 text-sm flex items-center">
                  <MapPin className="h-4 w-4 mr-1" /> {event.venue}, {event.location}
                </p>
              </div>
              <Badge variant="outline" className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded font-medium">
                {event.category}
              </Badge>
            </div>
            
            <div className="mt-4 flex items-center text-sm text-gray-700">
              <Calendar className="h-4 w-4 mr-1" /> {event.date}, {event.time}
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm text-gray-700 mb-2">About This Event</h4>
              <p className="text-sm text-gray-600">
                {event.description}
              </p>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium text-sm text-gray-700 mb-2">Price Range</h4>
              <p className="text-sm text-gray-600">{event.priceRange}</p>
            </div>
            
            <div className="mt-4 border-t pt-4">
              <h4 className="font-medium text-sm text-gray-700 mb-3">Looking for Buddies (24)</h4>
              
              <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
                {/* Sample profile images */}
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex flex-col items-center space-y-1 min-w-[60px]">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <span className="text-xs">User {index + 1}</span>
                  </div>
                ))}
                <div className="flex flex-col items-center space-y-1 min-w-[60px]">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">+19</span>
                  </div>
                  <span className="text-xs">More</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="p-4 border-t flex space-x-3">
          <Button variant="outline" className="flex-1">
            Add to Calendar
          </Button>
          <Button
            onClick={() => {
              onFindBuddies(event.id);
              onClose();
            }}
            className="flex-1"
          >
            Find Buddies
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
