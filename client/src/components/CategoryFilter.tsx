import { useState } from "react";
import { Button } from "@/components/ui/button";

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
  return (
    <div className="mb-6">
      <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
              activeCategory === category 
                ? "bg-primary text-white" 
                : "bg-white border border-gray-300 text-gray-700"
            }`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}
