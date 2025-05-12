import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "@shared/schema";
import { UserIcon } from "lucide-react";

interface UserCardProps {
  user: {
    id: number;
    displayName: string;
    profileImageUrl?: string;
    bio?: string;
    interests: string[];
    matchPercentage: number;
  };
  onConnect: (userId: number) => void;
}

export default function UserCard({ user, onConnect }: UserCardProps) {
  return (
    <Card className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col items-center">
          {user.profileImageUrl ? (
            <img 
              src={user.profileImageUrl} 
              alt={`${user.displayName}'s profile`}
              className="w-20 h-20 rounded-full object-cover mb-3" 
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3">
              <UserIcon className="h-8 w-8 text-gray-500" />
            </div>
          )}
          
          <h4 className="font-semibold text-base">{user.displayName}</h4>
          <p className="text-gray-500 text-sm">{user.bio || "Event Enthusiast"}</p>
          
          <Badge className="mt-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            {user.matchPercentage}% Match
          </Badge>
        </div>
        
        <div className="mt-3 flex flex-wrap justify-center gap-1">
          {user.interests.map((interest) => (
            <Badge 
              key={interest} 
              variant="outline"
              className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
            >
              {interest}
            </Badge>
          ))}
        </div>
        
        <Button
          onClick={() => onConnect(user.id)}
          className="mt-4 w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Connect
        </Button>
      </CardContent>
    </Card>
  );
}
