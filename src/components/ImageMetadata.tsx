import React from 'react';
import { motion } from 'framer-motion';
import { ImageStats } from './ImageStats';
import { ImageTags } from './ImageTags';
import { PromptCopyButton } from './PromptCopyButton';
import type { GeneratedImage } from '../types/image';

interface ImageMetadataProps {
  image: GeneratedImage;
  className?: string;
}

export function ImageMetadata({ image, className }: ImageMetadataProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <div className="mb-3">
        <h3 className="text-lg font-semibold mb-1">{image.title}</h3>
        <p className="text-sm text-gray-600">{image.prompt}</p>
        <PromptCopyButton prompt={image.prompt} />
      </div>

      <ImageTags tags={image.tags} className="mb-3" />
      
      <div className="flex items-center justify-between">
        <ImageStats
          views={image.views || 0}
          copies={image.promptCopies || 0}
          shares={image.shares || 0}
        />
        <div className="text-sm text-gray-500">
          נוצר על ידי {image.creator || 'אנונימי'}
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-400">
        networkjo.io | NirkoArt
      </div>
    </motion.div>
  );
}