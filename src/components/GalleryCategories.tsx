import React from 'react';
import { motion } from 'framer-motion';
import { predefinedCategories } from '../lib/categories';
import { cn } from '../lib/utils';

interface GalleryCategoriesProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

export function GalleryCategories({ selectedCategory, onCategorySelect }: GalleryCategoriesProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">קטגוריות</h2>
      <div className="flex flex-wrap gap-3">
        {predefinedCategories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategorySelect(category.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
              selectedCategory === category.id
                ? "bg-indigo-600 text-white"
                : "bg-white hover:bg-indigo-50 text-gray-700"
            )}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}