import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface StyleButtonProps {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
}

export function StyleButton({ label, icon, onClick, isActive }: StyleButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        'bg-white border-2 border-indigo-200 hover:border-indigo-400',
        'shadow-sm hover:shadow-md',
        isActive && 'border-indigo-600 bg-indigo-50'
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 justify-center">
        {icon}
        <span>{label}</span>
      </div>
    </motion.button>
  );
}