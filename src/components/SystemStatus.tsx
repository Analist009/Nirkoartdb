import React from 'react';
import { motion } from 'framer-motion';
import { Database, Cpu, Wifi, AlertCircle } from 'lucide-react';
import { useSystemStatus } from '../store/useSystemStatus';
import { cn } from '../lib/utils';

export function SystemStatus() {
  const { apiStatus, dbStatus, networkLatency } = useSystemStatus();

  return (
    <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <Cpu className={cn(
          "w-4 h-4",
          apiStatus === 'online' ? "text-green-500" : "text-red-500"
        )} />
        <span>API: {apiStatus === 'online' ? 'מחובר' : 'מנותק'}</span>
      </div>

      <div className="flex items-center gap-2">
        <Database className={cn(
          "w-4 h-4",
          dbStatus === 'connected' ? "text-green-500" : "text-red-500"
        )} />
        <span>מסד נתונים: {dbStatus === 'connected' ? 'מחובר' : 'מנותק'}</span>
      </div>

      <div className="flex items-center gap-2">
        <Wifi className="w-4 h-4 text-blue-500" />
        <span>תגובה: {networkLatency}ms</span>
      </div>

      {(apiStatus !== 'online' || dbStatus !== 'connected') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-red-600"
        >
          <AlertCircle className="w-4 h-4" />
          <span>יש בעיית התחברות למערכת</span>
        </motion.div>
      )}
    </div>
  );
}