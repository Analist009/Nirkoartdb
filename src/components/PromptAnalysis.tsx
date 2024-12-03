import React from 'react';
import { motion } from 'framer-motion';
import { Tag, Copy, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface PromptAnalysisProps {
  summary: string;
  tags: string[];
  originalPrompt: string;
  enhancedPrompt: string;
}

export function PromptAnalysis({ summary, tags, originalPrompt, enhancedPrompt }: PromptAnalysisProps) {
  const copyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast.success('הפרומפט הועתק בהצלחה');
    } catch (error) {
      toast.error('שגיאה בהעתקת הפרומפט');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 space-y-4"
    >
      <div>
        <h3 className="text-lg font-semibold mb-2">סיכום</h3>
        <p className="text-gray-700">{summary}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">תגיות</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full"
            >
              <Tag className="h-4 w-4" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">פרומפט מקורי</h3>
        <div className="flex items-start gap-2">
          <p className="flex-1 text-gray-700">{originalPrompt}</p>
          <button
            onClick={() => copyPrompt(originalPrompt)}
            className="p-2 text-gray-500 hover:text-indigo-600"
            title="העתק פרומפט מקורי"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">פרומפט משופר</h3>
        <div className="flex items-start gap-2">
          <p className="flex-1 text-gray-700">{enhancedPrompt}</p>
          <button
            onClick={() => copyPrompt(enhancedPrompt)}
            className="p-2 text-gray-500 hover:text-indigo-600"
            title="העתק פרומפט משופר"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}