import React from 'react';
import { motion } from 'framer-motion';
import { User, Image as ImageIcon, Star, Share2 } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useImageStore } from '../store/useImageStore';

export function UserProfile() {
  const { name, email, credits, imagesGenerated } = useUserStore();
  const { images } = useImageStore();
  const userImages = useImageStore((state) => state.getImagesByUser(useUserStore.getState().id || ''));

  const stats = {
    totalLikes: userImages.reduce((sum, img) => sum + (img.rating || 0), 0),
    totalShares: userImages.reduce((sum, img) => sum + (img.shares || 0), 0),
    averageRating: userImages.length 
      ? userImages.reduce((sum, img) => sum + (img.rating || 0), 0) / userImages.length 
      : 0
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{name || 'משתמש אנונימי'}</h2>
          <p className="text-gray-600">{email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <ImageIcon className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
          <div className="text-2xl font-bold">{imagesGenerated}</div>
          <div className="text-sm text-gray-600">תמונות שנוצרו</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <Star className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
          <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
          <div className="text-sm text-gray-600">דירוג ממוצע</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <Share2 className="w-6 h-6 mx-auto mb-2 text-green-500" />
          <div className="text-2xl font-bold">{stats.totalShares}</div>
          <div className="text-sm text-gray-600">שיתופים</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600">{credits}</div>
          <div className="text-sm text-gray-600">קרדיטים נותרו</div>
        </div>
      </div>

      {credits <= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800"
        >
          <p className="text-sm">
            {credits === 0 
              ? 'נגמרו לך הקרדיטים. אנא רכוש קרדיטים נוספים כדי להמשיך ליצור.'
              : `נותרו לך ${credits} קרדיטים בלבד. מומלץ לרכוש קרדיטים נוספים בקרוב.`
            }
          </p>
        </motion.div>
      )}
    </div>
  );
}