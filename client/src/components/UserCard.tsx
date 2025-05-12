import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "@shared/schema";
import { UserIcon, MessageCircleIcon } from "lucide-react";
import { motion } from "framer-motion";

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
  index?: number; // Optional index for staggered animations
}

export default function UserCard({ user, onConnect, index = 0 }: UserCardProps) {
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
        delay: index * 0.1 + 0.2, // Staggered delay
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

  const badgeVariants = {
    hidden: { scale: 0 },
    visible: (custom: number) => ({ 
      scale: 1,
      transition: {
        delay: index * 0.1 + 0.3 + (custom * 0.05),
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    })
  };

  const matchBadgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        delay: index * 0.1 + 0.4,
        type: "spring",
        stiffness: 200
      }
    },
    hover: { 
      scale: 1.1,
      transition: {
        duration: 0.2
      }
    }
  };

  // Background gradient is based on match percentage
  const getBgGradient = () => {
    if (user.matchPercentage >= 90) {
      return "linear-gradient(45deg, hsla(var(--green), 0.1), hsla(var(--primary), 0.1))";
    } else if (user.matchPercentage >= 80) {
      return "linear-gradient(45deg, hsla(var(--primary), 0.1), hsla(var(--purple), 0.1))";
    } else {
      return "linear-gradient(45deg, hsla(var(--secondary), 0.07), hsla(var(--purple), 0.07))";
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      className="user-card"
    >
      <Card className="border-0 h-full" style={{ background: getBgGradient() }}>
        <CardContent className="p-5">
          <div className="flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: {
                  delay: index * 0.1 + 0.3,
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }
              }}
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              {user.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt={`${user.displayName}'s profile`}
                  className="w-20 h-20 rounded-full object-cover mb-3 ring-2 ring-white shadow-md" 
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-purple/20 flex items-center justify-center mb-3 ring-2 ring-white shadow-md">
                  <UserIcon className="h-8 w-8 text-primary/70" />
                </div>
              )}
              
              <motion.div
                variants={matchBadgeVariants}
                className="absolute -bottom-1 -right-1"
              >
                <div className="match-badge shadow-sm">
                  {user.matchPercentage}% Match
                </div>
              </motion.div>
            </motion.div>
            
            <motion.h4 
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { delay: index * 0.1 + 0.35 }
              }}
              className="font-bold text-base mt-2"
            >
              {user.displayName}
            </motion.h4>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { delay: index * 0.1 + 0.4 }
              }}
              className="text-gray-600 text-sm text-center mt-1"
            >
              {user.bio || "Event Enthusiast"}
            </motion.p>
          </div>
          
          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            {user.interests.map((interest, i) => (
              <motion.div
                key={interest}
                custom={i} // Pass index as custom prop
                variants={badgeVariants}
              >
                <Badge 
                  variant="outline"
                  className="bg-white/80 backdrop-blur-sm text-primary-800 text-xs px-2.5 py-1 rounded-full border-0 shadow-sm"
                >
                  {interest}
                </Badge>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: index * 0.1 + 0.6 }
            }}
            className="mt-5 flex gap-2"
          >
            <motion.div className="w-full" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={() => onConnect(user.id)}
                className="connect-button w-full"
              >
                <span className="mr-1.5">Connect</span> 
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
              <Button
                variant="outline"
                className="p-2 rounded-lg border-0 bg-white shadow-sm"
                onClick={() => onConnect(user.id)}
              >
                <MessageCircleIcon className="h-5 w-5 text-primary" />
              </Button>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
