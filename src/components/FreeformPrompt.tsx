import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send } from 'lucide-react';
import { cn } from '../lib/utils';

interface FreeformPromptProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export function FreeformPrompt({ onSubmit, isLoading }: FreeformPromptProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt.trim());
      setPrompt('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="תאר את התמונה שברצונך ליצור בחופשיות..."
          className={cn(
            "w-full px-4 py-3 text-right rounded-lg resize-none",
            "border-2 border-indigo-200 focus:border-indigo-500",
            "focus:ring-2 focus:ring-indigo-200 outline-none",
            "min-h-[100px] transition-all"
          )}
          dir="rtl"
        />
        <div className="absolute left-2 bottom-2 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg",
              "bg-indigo-600 text-white transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4" />
            <span>צור תמונה</span>
          </motion.button>
          <motion.div
            animate={isLoading ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className={cn("p-2", !isLoading && "hidden")}
          >
            <Sparkles className="h-5 w-5 text-indigo-600" />
          </motion.div>
        </div>
      </div>
    </form>
  );
}