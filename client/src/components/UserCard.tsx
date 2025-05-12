import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "@shared/schema";
import { UserIcon } from "lucide-react";
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
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
    >
      <Card className="bg-white rounded-xl overflow-hidden h-full">
        <CardContent className="p-4">
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
            >
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
            </motion.div>
            
            <motion.h4 
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { delay: index * 0.1 + 0.35 }
              }}
              className="font-semibold text-base"
            >
              {user.displayName}
            </motion.h4>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { delay: index * 0.1 + 0.4 }
              }}
              className="text-gray-500 text-sm"
            >
              {user.bio || "Event Enthusiast"}
            </motion.p>
            
            <motion.div
              variants={matchBadgeVariants}
            >
              <Badge className="mt-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {user.matchPercentage}% Match
              </Badge>
            </motion.div>
          </div>
          
          <div className="mt-3 flex flex-wrap justify-center gap-1">
            {user.interests.map((interest, i) => (
              <motion.div
                key={interest}
                custom={i} // Pass index as custom prop
                variants={badgeVariants}
              >
                <Badge 
                  variant="outline"
                  className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
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
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              onClick={() => onConnect(user.id)}
              className="mt-4 w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg text-sm font-medium"
            >
              Connect
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
