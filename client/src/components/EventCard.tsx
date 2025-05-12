import { Link } from "wouter";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CalendarIcon, 
  MapPinIcon, 
  UsersIcon 
} from "lucide-react";
import { Event } from "@shared/schema";
import { motion } from "framer-motion";
import { useState } from "react";

interface EventCardProps {
  event: Event;
  onFindBuddies: (eventId: number) => void;
  index?: number; // Optional index for staggered animations
}

export default function EventCard({ event, onFindBuddies, index = 0 }: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 50,
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5,
        delay: index * 0.1, // Staggered delay based on index
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 15 
      }
    }
  };

  const imageVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  const badgeVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        delay: index * 0.1 + 0.3,
        duration: 0.3
      }
    }
  };

  const titleVariants = {
    hover: { 
      color: "var(--primary)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="bg-white rounded-xl overflow-hidden h-full flex flex-col">
        <div className="relative overflow-hidden">
          <motion.img 
            variants={imageVariants}
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-48 object-cover" 
          />
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className="absolute top-3 right-3 bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center"
          >
            <UsersIcon className="h-3 w-3 mr-1" />
            <span>24 buddies looking</span>
          </motion.div>
        </div>
        
        <CardContent className="p-4 flex-grow flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <motion.div variants={titleVariants}>
                <Link href={`/event/${event.id}`} className="font-semibold text-lg mb-1 inline-block">
                  {event.title}
                </Link>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                className="text-gray-500 text-sm flex items-center"
              >
                <MapPinIcon className="h-3 w-3 mr-1" /> 
                {event.venue} • {event.location.split(',')[0]}
              </motion.p>
            </div>
            <motion.div variants={badgeVariants}>
              <Badge variant="outline" className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded font-medium">
                {event.category}
              </Badge>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.5 }}
            className="mt-3 flex items-center text-sm text-gray-700"
          >
            <CalendarIcon className="h-3 w-3 mr-1" /> 
            {event.date} • {event.time}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.6 }}
            className="mt-4 flex justify-between items-center mt-auto"
          >
            <span className="font-semibold">{event.priceRange}</span>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  onFindBuddies(event.id);
                }}
                className="bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
              >
                Find Buddies
              </Button>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
