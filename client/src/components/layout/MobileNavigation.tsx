import { Link, useLocation } from "wouter";
import { CalendarIcon, UsersIcon, MessageSquareIcon, UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MobileNavigation() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="lg:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10">
      <div className="flex items-center justify-around h-16">
        <Link href="/" className={`flex flex-col items-center justify-center ${
            isActive("/") ? "text-primary" : "text-gray-500"
          }`}>
            <CalendarIcon className="h-5 w-5" />
            <span className="text-xs mt-1">Events</span>
        </Link>
        
        <Link href="/find-buddies" className={`flex flex-col items-center justify-center ${
            isActive("/find-buddies") ? "text-primary" : "text-gray-500"
          }`}>
            <UsersIcon className="h-5 w-5" />
            <span className="text-xs mt-1">Buddies</span>
        </Link>
        
        <Link href="/messages" className={`flex flex-col items-center justify-center relative ${
            isActive("/messages") ? "text-primary" : "text-gray-500"
          }`}>
            <MessageSquareIcon className="h-5 w-5" />
            <span className="text-xs mt-1">Messages</span>
            <Badge 
              variant="secondary" 
              className="absolute -top-1 right-4 h-4 w-4 p-0 flex items-center justify-center"
            >
              3
            </Badge>
        </Link>
        
        <Link href="/profile" className={`flex flex-col items-center justify-center ${
            isActive("/profile") ? "text-primary" : "text-gray-500"
          }`}>
            <UserIcon className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
