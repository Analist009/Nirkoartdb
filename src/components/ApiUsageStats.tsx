import React from 'react';
import { useSession } from '../lib/session';
import { ImageIcon } from 'lucide-react';

export function ApiUsageStats() {
  const { apiUsage } = useSession();

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3">סטטיסטיקת שימוש ב-API</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-indigo-50 rounded-lg">
          <div className="text-2xl font-bold text-indigo-600">{apiUsage?.used || 0}</div>
          <div className="text-sm text-gray-600">תמונות שנוצרו</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{apiUsage?.remaining || 0}</div>
          <div className="text-sm text-gray-600">תמונות נותרו</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{apiUsage?.total || 0}</div>
          <div className="text-sm text-gray-600">סה"כ מכסה</div>
        </div>
      </div>
    </div>
  );
}