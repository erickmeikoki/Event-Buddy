import { useState } from "react";
import { MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocationSelectorProps {
  location: string;
  onLocationChange: (location: string) => void;
}

export default function LocationSelector({ location, onLocationChange }: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputLocation, setInputLocation] = useState(location);

  const handleChange = () => {
    onLocationChange(inputLocation);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center mb-6">
      <MapPinIcon className="text-primary mr-2 h-5 w-5" />
      <span className="font-medium">{location}</span>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="link" className="ml-2 text-primary text-sm p-0 h-auto">Change</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Location</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="location">Enter your location</Label>
              <Input 
                id="location" 
                value={inputLocation} 
                onChange={(e) => setInputLocation(e.target.value)} 
                placeholder="City, State" 
              />
            </div>
            <Button onClick={handleChange} className="w-full">Update Location</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
