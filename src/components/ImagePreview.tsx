import React from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Copy } from 'lucide-react';
import { formatTimestamp } from '../lib/utils';
import { ImageTags } from './ImageTags';
import { ImageRating } from './ImageRating';
import { PromptCopyButton } from './PromptCopyButton';
import { useImageStore } from '../store/useImageStore';
import type { GeneratedImage } from '../types/image';
import { addWatermark } from '../lib/watermark';
import { toast } from 'sonner';

interface ImagePreviewProps {
  image: GeneratedImage;
  onDownload: () => void;
  onShare: () => void;
}

export function ImagePreview({ image, onShare }: ImagePreviewProps) {
  const rateImage = useImageStore((state) => state.rateImage);

  const handleDownload = async () => {
    try {
      const watermarkedUrl = await addWatermark(image.url);
      const link = document.createElement('a');
      link.href = watermarkedUrl;
      link.download = `${image.title || 'image'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('התמונה הורדה בהצלחה');
    } catch (error) {
      console.error('Failed to download image:', error);
      toast.error('שגיאה בהורדת התמונה');
    }
  };

  const handleRate = (rating: number) => {
    rateImage(image.id, rating);
    toast.success('הדירוג נשמר בהצלחה');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="relative">
        <img 
          src={image.url} 
          alt={image.title} 
          className="w-full h-64 object-cover"
        />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-medium">{image.title}</h3>
          <span className="text-sm text-gray-500">{formatTimestamp(image.timestamp)}</span>
        </div>
        
        <div className="mb-3">
          <p className="text-sm text-gray-600">{image.prompt}</p>
          <PromptCopyButton prompt={image.prompt} />
        </div>
        
        <ImageTags tags={image.tags} />
        
        <div className="mt-3 mb-4">
          <ImageRating rating={image.rating} onRate={handleRate} />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Download className="h-4 w-4" />
            <span>הורדה</span>
          </button>
          <button
            onClick={onShare}
            className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
          >
            <Share2 className="h-4 w-4" />
            <span>שיתוף</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}