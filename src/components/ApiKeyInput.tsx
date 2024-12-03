import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Check, AlertCircle, Save } from 'lucide-react';
import { useSession } from '../lib/session';
import { cn } from '../lib/utils';

export function ApiKeyInput() {
  const { setApiKey, clearApiKey, isValid } = useSession();
  const [inputKey, setInputKey] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!inputKey.trim()) {
      return;
    }

    try {
      setApiKey(inputKey.trim());
      setShowSuccess(true);
      setInputKey('');
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בהגדרת המפתח');
    }
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="הזן מפתח OpenAI API"
            className={cn(
              "w-full px-4 py-2 text-right rounded-lg",
              "border-2 focus:outline-none focus:ring-2",
              "transition-all duration-200",
              isValid() ? "border-green-500" : "border-gray-300",
              error && "border-red-500"
            )}
            dir="rtl"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Key className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p>הנחיות למפתח API:</p>
          <ul className="list-disc list-inside space-y-1 mr-4">
            <li>המפתח חייב להתחיל ב-sk-</li>
            <li>יש להשתמש במפתח עם הרשאות מתאימות</li>
            <li>מומלץ להגדיר מגבלות שימוש</li>
            <li>שמור על המפתח בסודיות</li>
          </ul>
        </div>
        
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="h-4 w-4" />
            <span>שמור מפתח API</span>
          </motion.button>
          
          {isValid() && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => clearApiKey()}
              className="px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-50 transition-colors"
            >
              נקה
            </motion.button>
          )}
        </div>
      </form>

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-green-100 text-green-800 rounded-lg flex items-center gap-2"
        >
          <Check className="h-5 w-5" />
          <span>המפתח נשמר בהצלחה!</span>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-100 text-red-800 rounded-lg flex items-center gap-2"
        >
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
}