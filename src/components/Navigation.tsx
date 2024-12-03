import React from 'react';
import { Settings, Brain, Sparkles, ImageIcon, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { ApiKeyDialog } from './ApiKeyDialog';
import { cn } from '../lib/utils';

export function TopNavigation() {
  const [showSettings, setShowSettings] = React.useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 right-0 left-0 z-50"
    >
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <Brain className="h-8 w-8 text-white" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <Sparkles className="h-8 w-8 text-white/30" />
                </motion.div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">NirkoArt</h1>
                <p className="text-xs text-white/80">יצירת אמנות בעזרת AI</p>
              </div>
            </motion.div>
            
            <nav className="flex items-center gap-4">
              <NavButton icon={ImageIcon} label="גלריה" />
              <NavButton icon={History} label="היסטוריה" />
              <NavButton 
                icon={Settings} 
                label="הגדרות"
                onClick={() => setShowSettings(true)}
              />
            </nav>
          </div>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      
      <ApiKeyDialog open={showSettings} onClose={() => setShowSettings(false)} />
    </motion.header>
  );
}

interface NavButtonProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

function NavButton({ icon: Icon, label, onClick }: NavButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg",
        "text-white/80 hover:text-white hover:bg-white/10",
        "transition-colors"
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="hidden md:inline text-sm">{label}</span>
    </motion.button>
  );
}