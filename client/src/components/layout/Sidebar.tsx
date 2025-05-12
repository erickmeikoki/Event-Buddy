import { Link, useLocation } from "wouter";
import { FirebaseUser } from "@/lib/firebase";
import { 
  CalendarIcon, 
  UsersIcon, 
  MessageSquareIcon, 
  UserIcon, 
  SettingsIcon 
} from "lucide-react";

interface SidebarProps {
  currentUser: FirebaseUser | null;
}

export default function Sidebar({ currentUser }: SidebarProps) {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 p-4">
      <div className="flex items-center space-x-2 mb-8">
        <UserIcon className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-bold text-primary">EventBuddy</h1>
      </div>
      
      <nav className="space-y-1 flex-1">
        <Link href="/">
          <a className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
            isActive("/") 
              ? "bg-primary-50 text-primary-700" 
              : "text-gray-700 hover:bg-gray-100"
          }`}>
            <CalendarIcon className="h-5 w-5" />
            <span className="font-medium">Discover Events</span>
          </a>
        </Link>
        
        <Link href="/find-buddies">
          <a className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
            isActive("/find-buddies") 
              ? "bg-primary-50 text-primary-700" 
              : "text-gray-700 hover:bg-gray-100"
          }`}>
            <UsersIcon className="h-5 w-5" />
            <span className="font-medium">Find Buddies</span>
          </a>
        </Link>
        
        <Link href="/messages">
          <a className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
            isActive("/messages") 
              ? "bg-primary-50 text-primary-700" 
              : "text-gray-700 hover:bg-gray-100"
          }`}>
            <MessageSquareIcon className="h-5 w-5" />
            <span className="font-medium">Messages</span>
            <span className="ml-auto bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
          </a>
        </Link>
        
        <Link href="/profile">
          <a className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
            isActive("/profile") 
              ? "bg-primary-50 text-primary-700" 
              : "text-gray-700 hover:bg-gray-100"
          }`}>
            <UserIcon className="h-5 w-5" />
            <span className="font-medium">My Profile</span>
          </a>
        </Link>
        
        <Link href="/settings">
          <a className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
            isActive("/settings") 
              ? "bg-primary-50 text-primary-700" 
              : "text-gray-700 hover:bg-gray-100"
          }`}>
            <SettingsIcon className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </a>
        </Link>
      </nav>
      
      {currentUser ? (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center px-3 py-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={`${currentUser.displayName}'s profile`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <UserIcon className="h-5 w-5 text-gray-500" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                {currentUser.displayName || "User"}
              </p>
              <Link href="/profile">
                <a className="text-xs text-gray-500">View Profile</a>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="pt-4 border-t border-gray-200">
          <Link href="/login">
            <a className="block w-full bg-primary text-white py-2 rounded-lg text-sm font-medium text-center">
              Sign In
            </a>
          </Link>
          <Link href="/register">
            <a className="block w-full mt-2 text-primary py-2 rounded-lg text-sm font-medium text-center">
              Create Account
            </a>
          </Link>
        </div>
      )}
    </aside>
  );
}
