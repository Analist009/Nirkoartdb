import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Code, Star } from 'lucide-react';

export function AboutArtist() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 mb-8"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center">
          <Palette className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">מיכאל נירקו</h2>
          <p className="text-gray-600">אמן AI ומפתח תוכנה</p>
        </div>
      </div>

      <p className="text-gray-700 mb-6">
        מיכאל נירקו הוא אמן AI מוביל ומפתח תוכנה, המתמחה ביצירת אמנות דיגיטלית באמצעות בינה מלאכותית.
        עבודותיו משלבות טכנולוגיה מתקדמת עם ראייה אמנותית ייחודית, תוך שימוש בכלים חדשניים ליצירת
        תמונות מרהיבות ומקוריות.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-indigo-50 rounded-lg">
          <Palette className="w-6 h-6 text-indigo-600 mb-2" />
          <h3 className="font-semibold mb-1">אמנות AI</h3>
          <p className="text-sm text-gray-600">יצירת אמנות דיגיטלית מתקדמת</p>
        </div>
        
        <div className="p-4 bg-purple-50 rounded-lg">
          <Code className="w-6 h-6 text-purple-600 mb-2" />
          <h3 className="font-semibold mb-1">פיתוח תוכנה</h3>
          <p className="text-sm text-gray-600">פתרונות טכנולוגיים חדשניים</p>
        </div>
        
        <div className="p-4 bg-pink-50 rounded-lg">
          <Star className="w-6 h-6 text-pink-600 mb-2" />
          <h3 className="font-semibold mb-1">חדשנות</h3>
          <p className="text-sm text-gray-600">שילוב טכנולוגיה ואמנות</p>
        </div>
      </div>
    </motion.div>
  );
}