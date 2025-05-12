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
  UsersIcon, 
  HeartIcon
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
  const [isFavorite, setIsFavorite] = useState(false);
  
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
    hidden: { opacity: 0, scale: 0.7 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        delay: index * 0.1 + 0.3,
        duration: 0.3,
        type: "spring",
        stiffness: 260
      }
    }
  };

  const titleVariants = {
    hover: { 
      color: "hsl(var(--primary))",
      transition: { duration: 0.2 }
    }
  };

  const heartAnimProps = isFavorite 
    ? {
        scale: [1, 1.3, 1],
        transition: { duration: 0.4 },
        fill: "hsl(var(--secondary))"
      }
    : {};

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="event-card"
    >
      <Card className="bg-white h-full flex flex-col border-0">
        <div className="relative overflow-hidden event-image">
          <motion.img 
            variants={imageVariants}
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-52 object-cover" 
          />
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className="absolute top-3 right-3 bg-gradient-to-r from-secondary/90 to-pink/90 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-full flex items-center shadow-md"
          >
            <UsersIcon className="h-3 w-3 mr-1.5" />
            <span>24 buddies looking</span>
          </motion.div>
          
          <motion.button
            className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors shadow-md"
            onClick={() => setIsFavorite(!isFavorite)}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div animate={heartAnimProps}>
              <HeartIcon 
                className={`h-4 w-4 ${isFavorite ? 'text-transparent' : 'text-gray-700'}`}
                fill={isFavorite ? "currentColor" : "none"}
              />
            </motion.div>
          </motion.button>
          
          <motion.div
            className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/40 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          />
        </div>
        
        <CardContent className="p-5 flex-grow flex flex-col relative">
          <div className="flex justify-between items-start mb-1">
            <motion.div variants={titleVariants} className="mr-3">
              <Link href={`/event/${event.id}`} className="font-bold text-lg inline-block leading-tight">
                {event.title}
              </Link>
            </motion.div>
            <motion.div variants={badgeVariants}>
              <div className="event-badge">
                {event.category}
              </div>
            </motion.div>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.4 }}
            className="text-gray-600 text-sm flex items-center"
          >
            <MapPinIcon className="h-3.5 w-3.5 mr-1.5 text-primary/80" /> 
            {event.venue} • {event.location.split(',')[0]}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.5 }}
            className="mt-3 flex items-center text-sm text-gray-600"
          >
            <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-primary/80" /> 
            {event.date} • {event.time}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.6 }}
            className="mt-5 flex justify-between items-center mt-auto"
          >
            <span className="font-semibold text-sm bg-gradient-to-r from-purple to-primary bg-clip-text text-transparent">
              {event.priceRange || 'Free'}
            </span>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  onFindBuddies(event.id);
                }}
                className="bg-gradient-to-r from-primary to-purple hover:from-primary/90 hover:to-purple/90 text-white px-4 py-1.5 rounded-full text-sm font-medium border-0 shadow-md"
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
