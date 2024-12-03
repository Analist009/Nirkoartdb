import React from 'react';
import { Eye, Copy, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface ImageStatsProps {
  views: number;
  copies: number;
  shares: number;
  className?: string;
}

export function ImageStats({ views, copies, shares, className }: ImageStatsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("flex items-center gap-4 text-sm text-gray-600", className)}
    >
      <div className="flex items-center gap-1">
        <Eye className="h-4 w-4" />
        <span>{views}</span>
      </div>
      <div className="flex items-center gap-1">
        <Copy className="h-4 w-4" />
        <span>{copies}</span>
      </div>
      <div className="flex items-center gap-1">
        <Share2 className="h-4 w-4" />
        <span>{shares}</span>
      </div>
    </motion.div>
  );
}