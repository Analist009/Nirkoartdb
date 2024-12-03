import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { uploadToBlob } from '../lib/blob';
import { cn } from '../lib/utils';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  maxSize?: number; // in MB
  accept?: string;
  className?: string;
}

export function ImageUploader({ 
  onUpload, 
  maxSize = 4, 
  accept = 'image/*',
  className 
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`הקובץ גדול מדי. הגודל המקסימלי הוא ${maxSize}MB`);
      return;
    }

    try {
      setIsUploading(true);
      const filename = `uploads/${Date.now()}-${file.name}`;
      const url = await uploadToBlob({
        filename,
        data: file,
        access: 'public'
      });
      
      onUpload(url);
      toast.success('הקובץ הועלה בהצלחה');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('שגיאה בהעלאת הקובץ');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div
      className={cn(
        "relative",
        className
      )}
    >
      <motion.div
        className={cn(
          "border-2 border-dashed rounded-lg p-8",
          "flex flex-col items-center justify-center",
          "transition-colors cursor-pointer",
          isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && inputRef.current?.click()}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleFile(file);
            }
          }}
          className="hidden"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center gap-4">
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
              <p className="text-gray-600">מעלה קובץ...</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400" />
              <div className="text-center">
                <p className="text-gray-600">גרור קובץ לכאן או לחץ לבחירה</p>
                <p className="text-sm text-gray-500 mt-1">
                  {`קבצים עד ${maxSize}MB`}
                </p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}