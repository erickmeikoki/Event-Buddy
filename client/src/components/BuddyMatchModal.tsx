import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Info, UserPlus } from "lucide-react";
import { Event, User } from "@shared/schema";

interface MatchedUser {
  id: number;
  displayName: string;
  profileImageUrl?: string;
  bio?: string;
  interests: string[];
  matchPercentage: number;
}

interface BuddyMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  matches: MatchedUser[];
  onSendRequest: (eventId: number, message: string, userIds: number[]) => void;
}

export default function BuddyMatchModal({
  isOpen,
  onClose,
  event,
  matches,
  onSendRequest
}: BuddyMatchModalProps) {
  const [message, setMessage] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const toggleUserSelection = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSendToAll = () => {
    if (event) {
      onSendRequest(event.id, message, matches.map(match => match.id));
      onClose();
    }
  };

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-xl overflow-hidden max-w-lg w-full max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="flex items-center justify-between p-4 border-b">
          <DialogTitle className="font-semibold text-lg">Find Buddies for This Event</DialogTitle>
          <DialogClose className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </DialogClose>
        </DialogHeader>
        
        <div className="overflow-y-auto flex-1 p-4">
          <div className="mb-4">
            <p className="text-gray-700 mb-4">
              24 people are looking for buddies to attend <span className="font-medium">{event.title}</span>
            </p>
            
            <div className="p-3 rounded-lg bg-primary-50 border border-primary-100 flex space-x-3 items-center mb-4">
              <Info className="h-5 w-5 text-primary" />
              <p className="text-sm text-primary-700">We'll notify you when someone accepts your buddy request.</p>
            </div>
            
            <div className="bg-gray-100 p-3 rounded-lg mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Your Message (Optional)</h4>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Introduce yourself and let people know what you're looking for in an event buddy..."
                className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:outline-none resize-none"
                rows={3}
              />
            </div>
          </div>
          
          <h4 className="font-medium text-gray-700 mb-3">Top Matches</h4>
          
          <div className="space-y-3">
            {matches.map((match) => (
              <div 
                key={match.id} 
                className={`p-3 bg-white border rounded-lg flex items-center ${
                  selectedUsers.includes(match.id) ? "border-primary" : "border-gray-200"
                }`}
              >
                {match.profileImageUrl ? (
                  <img 
                    src={match.profileImageUrl} 
                    alt={`${match.displayName}'s profile`}
                    className="w-12 h-12 rounded-full mr-3" 
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <span className="text-gray-500 font-medium">
                      {match.displayName.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">{match.displayName}</h4>
                      <p className="text-gray-500 text-xs">{match.bio || "Event Enthusiast"}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {match.matchPercentage}% Match
                    </Badge>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {match.interests.slice(0, 3).map((interest) => (
                      <Badge 
                        key={interest} 
                        variant="outline"
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
                <button 
                  className={`ml-3 text-primary hover:text-primary/80`}
                  onClick={() => toggleUserSelection(match.id)}
                >
                  <UserPlus className={`h-5 w-5 ${selectedUsers.includes(match.id) ? "fill-primary" : ""}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter className="p-4 border-t flex space-x-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleSendToAll}
            disabled={selectedUsers.length === 0}
          >
            {selectedUsers.length > 0 
              ? `Send to ${selectedUsers.length} Selected` 
              : "Select Buddies"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
