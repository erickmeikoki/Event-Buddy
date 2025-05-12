import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, UserPlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import UserCard from "@/components/UserCard";

// Sample user data for demonstration
const SAMPLE_USERS = [
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
  },
  {
    id: 5,
    displayName: "Alex P.",
    bio: "Food & Drink Lover",
    interests: ["Restaurants", "Craft Beer", "Wine Tasting"],
    matchPercentage: 78
  },
  {
    id: 6,
    displayName: "Taylor W.",
    bio: "Movie Buff",
    interests: ["Cinema", "Film Festivals", "Documentaries"],
    matchPercentage: 75
  },
  {
    id: 7,
    displayName: "Jordan B.",
    bio: "Outdoor Adventurer",
    interests: ["Hiking", "Camping", "Rock Climbing"],
    matchPercentage: 72
  },
  {
    id: 8,
    displayName: "Casey M.",
    bio: "Tech Enthusiast",
    interests: ["Technology", "Gaming", "Coding"],
    matchPercentage: 68
  }
];

// Sample interest categories
const INTEREST_CATEGORIES = [
  "Music",
  "Sports",
  "Arts & Culture",
  "Food & Drink",
  "Nightlife",
  "Outdoor Activities",
  "Technology",
  "Cinema & Films"
];

export default function FindBuddiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [minMatchPercentage, setMinMatchPercentage] = useState(50);
  const [sortBy, setSortBy] = useState("match");
  
  // Filter and sort users based on filters
  const filteredUsers = SAMPLE_USERS
    .filter(user => 
      // Filter by search query (name or bio)
      (user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.bio.toLowerCase().includes(searchQuery.toLowerCase())) &&
      // Filter by minimum match percentage
      user.matchPercentage >= minMatchPercentage &&
      // Filter by selected interests (if any are selected)
      (selectedInterests.length === 0 || 
        user.interests.some(interest => 
          selectedInterests.some(selected => 
            interest.toLowerCase().includes(selected.toLowerCase())
          )
        ))
    )
    .sort((a, b) => {
      // Sort by selected criteria
      if (sortBy === "match") {
        return b.matchPercentage - a.matchPercentage;
      } else if (sortBy === "name") {
        return a.displayName.localeCompare(b.displayName);
      }
      return 0;
    });

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };
  
  const handleConnect = (userId: number) => {
    console.log(`Connecting with user ${userId}`);
    // In a real app, this would send a connection request
  };
  
  const resetFilters = () => {
    setSelectedInterests([]);
    setMinMatchPercentage(50);
    setSortBy("match");
  };

  return (
    <div className="p-4 lg:p-8 pb-20 lg:pb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <h2 className="text-2xl font-bold mb-4 lg:mb-0">Find Buddies</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Search by name or interests"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {(selectedInterests.length > 0 || minMatchPercentage > 50) && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                    {selectedInterests.length + (minMatchPercentage > 50 ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filter Buddies</SheetTitle>
              </SheetHeader>
              
              <div className="py-6 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Sort By</h3>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="match">Match Percentage</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Minimum Match</h3>
                    <span className="text-sm">{minMatchPercentage}%</span>
                  </div>
                  <Slider
                    value={[minMatchPercentage]}
                    onValueChange={(value) => setMinMatchPercentage(value[0])}
                    min={0}
                    max={100}
                    step={5}
                  />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_CATEGORIES.map((interest) => (
                      <Badge
                        key={interest}
                        variant={selectedInterests.includes(interest) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <SheetFooter className="sm:justify-between">
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
                <SheetClose asChild>
                  <Button>Apply Filters</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {selectedInterests.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedInterests.map((interest) => (
            <Badge
              key={interest}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {interest}
              <button
                className="ml-1 rounded-full hover:bg-secondary/20"
                onClick={() => toggleInterest(interest)}
              >
                ✕
              </button>
            </Badge>
          ))}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs"
            onClick={resetFilters}
          >
            Clear all
          </Button>
        </div>
      )}
      
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredUsers.map((user) => (
            <UserCard 
              key={user.id} 
              user={user} 
              onConnect={handleConnect} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <UserPlusIcon className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">No Matches Found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria to find more buddies.</p>
          <Button onClick={resetFilters}>Reset Filters</Button>
        </div>
      )}
    </div>
  );
}
