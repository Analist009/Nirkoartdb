import React from 'react';
import { motion } from 'framer-motion';
import { LogIn, Key } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';

interface LoginPromptProps {
  onClose?: () => void;
}

export function LoginPrompt({ onClose }: LoginPromptProps) {
  const setUser = useUserStore((state) => state.setUser);

  const handleLogin = () => {
    // For demo purposes, create a temporary user
    setUser({
      id: `user-${Date.now()}`,
      name: 'משתמש זמני',
      email: 'guest@example.com'
    });
    onClose?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-auto"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
          <Key className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">נדרשת התחברות</h2>
          <p className="text-gray-600">כדי ליצור תמונות, עליך להתחבר תחילה</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-gray-700">
          התחברות מאפשרת לך:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>יצירת תמונות חדשות</li>
          <li>שמירת היסטוריית התמונות שלך</li>
          <li>שיתוף תמונות עם אחרים</li>
          <li>קבלת קרדיטים חינם</li>
        </ul>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogin}
          className="w-full mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
        >
          <LogIn className="w-5 h-5" />
          <span>התחבר עכשיו</span>
        </motion.button>

        <p className="text-center text-sm text-gray-500 mt-4">
          יצירת חשבון מעניקה לך 10 קרדיטים חינם!
        </p>
      </div>
    </motion.div>
  );
}