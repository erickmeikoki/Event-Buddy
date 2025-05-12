import { Link } from "wouter";
import { UserIcon, SearchIcon, MessageSquareIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MobileHeader() {
  return (
    <header className="lg:hidden bg-white shadow-sm py-4 px-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center space-x-2">
        <UserIcon className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-bold text-primary">EventBuddy</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-600">
          <SearchIcon className="h-5 w-5" />
        </button>
        <Link href="/messages">
          <a className="text-gray-600 relative">
            <MessageSquareIcon className="h-5 w-5" />
            <Badge 
              variant="secondary" 
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center"
            >
              3
            </Badge>
          </a>
        </Link>
      </div>
    </header>
  );
}
