import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Icons for categories
import { 
  CalendarDaysIcon, 
  MusicIcon, 
  Dumbbell, 
  UtensilsCrossedIcon, 
  PaintbrushIcon,
  MoonIcon,
  SquareStackIcon
} from "lucide-react";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({ 
  categories, 
  activeCategory, 
  onSelectCategory 
}: CategoryFilterProps) {
  // Map category names to icons
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "All Events":
        return <CalendarDaysIcon className="h-4 w-4 mr-1.5" />;
      case "Concerts":
        return <MusicIcon className="h-4 w-4 mr-1.5" />;
      case "Sports":
        return <Dumbbell className="h-4 w-4 mr-1.5" />;
      case "Food & Drink":
        return <UtensilsCrossedIcon className="h-4 w-4 mr-1.5" />;
      case "Arts":
        return <PaintbrushIcon className="h-4 w-4 mr-1.5" />;
      case "Nightlife":
        return <MoonIcon className="h-4 w-4 mr-1.5" />;
      default:
        return <SquareStackIcon className="h-4 w-4 mr-1.5" />;
    }
  };

  // Animation variants for staggered appearance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 260,
        damping: 20 
      }
    }
  };

  // For the active item highlight animation
  const [highlightWidth, setHighlightWidth] = useState(0);
  const [highlightLeft, setHighlightLeft] = useState(0);
  
  useEffect(() => {
    // This is just a placeholder - in a real app, we'd measure the actual DOM elements
    // Just for visual effect here, we'll use an approximation
    const index = categories.findIndex(cat => cat === activeCategory);
    setHighlightLeft(index * 120 + index * 8); // Approximation of button width + spacing
    setHighlightWidth(activeCategory.length * 9 + 50); // Approximation based on text length
  }, [activeCategory, categories]);

  return (
    <div className="mb-8 mt-2">
      <motion.div 
        className="flex space-x-2 overflow-x-auto pb-3 relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categories.map((category, index) => (
          <motion.div
            key={category}
            variants={itemVariants}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              className={`category-button ${
                activeCategory === category ? "active" : "bg-white/80 backdrop-blur-sm text-gray-700"
              }`}
              onClick={() => onSelectCategory(category)}
            >
              {getCategoryIcon(category)}
              {category}
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
