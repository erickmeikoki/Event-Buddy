import { useState, useEffect } from "react";
import { MapPinIcon, NavigationIcon, SearchIcon, MapIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

const POPULAR_LOCATIONS = [
  "San Francisco, CA",
  "Los Angeles, CA",
  "New York, NY",
  "Seattle, WA",
  "Chicago, IL",
  "Austin, TX"
];

interface LocationSelectorProps {
  location: string;
  onLocationChange: (location: string) => void;
}

export default function LocationSelector({ location, onLocationChange }: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputLocation, setInputLocation] = useState(location);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = () => {
    onLocationChange(inputLocation);
    setIsOpen(false);
  };

  const handleUseCurrentLocation = () => {
    setIsGeolocating(true);
    // Simulating geolocation
    setTimeout(() => {
      setInputLocation("San Francisco, CA");
      setIsGeolocating(false);
    }, 1500);
  };

  // Simulate search suggestions
  useEffect(() => {
    if (inputLocation && inputLocation !== location) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setShowSuggestions(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowSuggestions(false);
    }
  }, [inputLocation, location]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-7 mt-2"
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-full shadow-md py-2.5 px-4 flex items-center">
        <MapPinIcon className="text-secondary mr-2 h-5 w-5" />
        <span className="font-medium text-gray-800">{location}</span>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              className="ml-2 text-primary text-sm p-1 px-2 h-auto rounded-full bg-primary/10 hover:bg-primary/20"
            >
              Change
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-purple bg-clip-text text-transparent">
                Find events near you
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input 
                    id="location" 
                    value={inputLocation} 
                    onChange={(e) => setInputLocation(e.target.value)} 
                    placeholder="City, State or Zip Code" 
                    className="pl-9 border rounded-full shadow-sm"
                  />
                  {isLoading && (
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <div className="h-4 w-4 border-2 border-t-primary rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {showSuggestions && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border rounded-lg overflow-hidden shadow-sm"
                    >
                      {POPULAR_LOCATIONS.filter(loc => 
                        loc.toLowerCase().includes(inputLocation.toLowerCase())
                      ).slice(0, 3).map(loc => (
                        <motion.div
                          key={loc}
                          whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                          className="p-2 px-3 cursor-pointer flex items-center"
                          onClick={() => {
                            setInputLocation(loc);
                            setShowSuggestions(false);
                          }}
                        >
                          <MapIcon className="h-3.5 w-3.5 text-gray-500 mr-2" />
                          <span>{loc}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={handleUseCurrentLocation} 
                  variant="outline"
                  disabled={isGeolocating}
                  className="relative overflow-hidden flex items-center gap-2"
                >
                  {isGeolocating ? (
                    <>
                      <div className="h-4 w-4 border-2 border-t-primary rounded-full animate-spin mr-2" />
                      Finding your location...
                    </>
                  ) : (
                    <>
                      <NavigationIcon className="h-4 w-4 text-primary" />
                      Use current location
                    </>
                  )}
                </Button>
                
                <div className="text-sm text-gray-500 mt-1 px-1">
                  Popular locations:
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {POPULAR_LOCATIONS.slice(0, 3).map(loc => (
                    <Button
                      key={loc}
                      variant="ghost"
                      size="sm"
                      className={`px-3 py-1 rounded-full text-xs ${
                        loc === inputLocation 
                          ? 'bg-primary/20 text-primary'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => setInputLocation(loc)}
                    >
                      {loc === inputLocation && <CheckIcon className="h-3 w-3 mr-1" />}
                      {loc}
                    </Button>
                  ))}
                </div>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={handleChange} 
                  className="w-full rounded-full bg-gradient-to-r from-primary to-purple text-white shadow-md"
                >
                  Update Location
                </Button>
              </motion.div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
}
