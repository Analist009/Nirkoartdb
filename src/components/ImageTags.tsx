import React from 'react';
import { Tag } from 'lucide-react';
import { ImageTag } from '../types/image';

interface ImageTagsProps {
  tags: ImageTag[];
  onTagClick?: (tag: ImageTag) => void;
}

export function ImageTags({ tags, onTagClick }: ImageTagsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => onTagClick?.(tag)}
          className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors"
        >
          <Tag className="h-3 w-3" />
          <span>{tag.name}</span>
        </button>
      ))}
    </div>
  );
}