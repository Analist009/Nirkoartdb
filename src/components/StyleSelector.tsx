import React from 'react';
import { motion } from 'framer-motion';
import { Palette, User, Sparkles } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { artistStyles, artStyles } from '../data/styles';
import { cn } from '../lib/utils';

interface StyleSelectorProps {
  onArtistStyleChange: (style: string | null) => void;
  onArtStyleChange: (style: string | null) => void;
  selectedArtistStyle: string | null;
  selectedArtStyle: string | null;
}

export function StyleSelector({
  onArtistStyleChange,
  onArtStyleChange,
  selectedArtistStyle,
  selectedArtStyle
}: StyleSelectorProps) {
  return (
    <Tabs.Root defaultValue="artists" className="bg-white rounded-xl shadow-lg p-6">
      <Tabs.List className="flex gap-4 mb-6 border-b">
        <Tabs.Trigger
          value="artists"
          className={cn(
            "flex items-center gap-2 px-4 py-2 border-b-2 transition-colors",
            "hover:text-indigo-600",
            "data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600"
          )}
        >
          <User className="h-5 w-5" />
          <span>סגנון אמן</span>
        </Tabs.Trigger>
        
        <Tabs.Trigger
          value="styles"
          className={cn(
            "flex items-center gap-2 px-4 py-2 border-b-2 transition-colors",
            "hover:text-indigo-600",
            "data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600"
          )}
        >
          <Palette className="h-5 w-5" />
          <span>סגנון אמנות</span>
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="artists" className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {artistStyles.map((style) => (
            <StyleButton
              key={style.id}
              label={style.label}
              isSelected={selectedArtistStyle === style.id}
              onClick={() => onArtistStyleChange(selectedArtistStyle === style.id ? null : style.id)}
            />
          ))}
        </div>
      </Tabs.Content>

      <Tabs.Content value="styles" className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {artStyles.map((style) => (
            <StyleButton
              key={style.id}
              label={style.label}
              isSelected={selectedArtStyle === style.id}
              onClick={() => onArtStyleChange(selectedArtStyle === style.id ? null : style.id)}
            />
          ))}
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
}

interface StyleButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

function StyleButton({ label, isSelected, onClick }: StyleButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative p-4 rounded-lg text-center transition-all",
        "border-2 hover:border-indigo-300",
        isSelected
          ? "border-indigo-500 bg-indigo-50"
          : "border-gray-200"
      )}
    >
      <span className="text-sm font-medium">{label}</span>
      {isSelected && (
        <motion.div
          className="absolute -top-1 -right-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <Sparkles className="h-4 w-4 text-indigo-500" />
        </motion.div>
      )}
    </motion.button>
  );
}