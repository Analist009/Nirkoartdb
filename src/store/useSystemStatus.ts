import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { OpenAI } from 'openai';
import { useSession } from '../lib/session';

type ApiStatus = 'online' | 'offline' | 'error';
type DbStatus = 'connected' | 'disconnected' | 'error';

interface SystemStatusState {
  apiStatus: ApiStatus;
  dbStatus: DbStatus;
  networkLatency: number;
  checkApiStatus: () => Promise<void>;
  checkDbStatus: () => Promise<void>;
  measureLatency: () => Promise<void>;
  startMonitoring: () => void;
  stopMonitoring: () => void;
}

export const useSystemStatus = create<SystemStatusState>((set, get) => {
  let monitoringInterval: number | null = null;

  const checkApiStatus = async () => {
    const session = useSession.getState();
    if (!session.apiKey) {
      set({ apiStatus: 'offline' });
      return;
    }

    try {
      const openai = new OpenAI({
        apiKey: session.apiKey,
        dangerouslyAllowBrowser: true
      });

      const start = Date.now();
      await openai.models.list();
      const latency = Date.now() - start;

      set({ 
        apiStatus: 'online',
        networkLatency: latency
      });
    } catch (error) {
      set({ apiStatus: 'error' });
    }
  };

  const checkDbStatus = async () => {
    try {
      const start = Date.now();
      const { error } = await supabase.from('health_check').select('count');
      const latency = Date.now() - start;

      set({ 
        dbStatus: error ? 'error' : 'connected',
        networkLatency: Math.min(get().networkLatency, latency)
      });
    } catch {
      set({ dbStatus: 'disconnected' });
    }
  };

  const measureLatency = async () => {
    const start = Date.now();
    try {
      await fetch('/api/ping');
      const latency = Date.now() - start;
      set({ networkLatency: latency });
    } catch {
      // Keep the last known latency
    }
  };

  return {
    apiStatus: 'offline',
    dbStatus: 'disconnected',
    networkLatency: 0,
    checkApiStatus,
    checkDbStatus,
    measureLatency,
    startMonitoring: () => {
      // Initial checks
      checkApiStatus();
      checkDbStatus();
      measureLatency();

      // Start periodic monitoring
      monitoringInterval = window.setInterval(() => {
        checkApiStatus();
        checkDbStatus();
        measureLatency();
      }, 30000); // Check every 30 seconds
    },
    stopMonitoring: () => {
      if (monitoringInterval) {
        clearInterval(monitoringInterval);
        monitoringInterval = null;
      }
    }
  };
});