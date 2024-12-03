import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

interface ApiUsage {
  used: number;
  remaining: number;
  total: number;
  resetDate: string;
}

interface SessionState {
  apiKey: string | null;
  expiresAt: number | null;
  apiUsage: ApiUsage | null;
  isPro: boolean;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  isValid: () => boolean;
  updateApiUsage: (usage: ApiUsage) => void;
  setPro: (isPro: boolean) => void;
}

const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      apiKey: null,
      expiresAt: null,
      apiUsage: null,
      isPro: false,
      setApiKey: (key: string) => {
        try {
          if (!key.startsWith('sk-')) {
            throw new Error('מפתח API לא תקין');
          }
          set({
            apiKey: key,
            expiresAt: Date.now() + SESSION_DURATION,
          });
          toast.success('המפתח נשמר בהצלחה');
        } catch (error) {
          toast.error('שגיאה', {
            description: error instanceof Error ? error.message : 'שגיאה בהגדרת המפתח'
          });
          throw error;
        }
      },
      clearApiKey: () => {
        set({ apiKey: null, expiresAt: null, apiUsage: null });
        toast.success('המפתח נמחק בהצלחה');
      },
      isValid: () => {
        const state = get();
        if (!state.apiKey || !state.expiresAt) return false;
        if (Date.now() > state.expiresAt) {
          state.clearApiKey();
          return false;
        }
        return true;
      },
      updateApiUsage: (usage: ApiUsage) => {
        set({ apiUsage: usage });
      },
      setPro: (isPro: boolean) => {
        set({ isPro });
        if (isPro) {
          toast.success('חשבון Pro הופעל בהצלחה!');
        }
      }
    }),
    {
      name: 'api-session',
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        }
      }
    }
  )
);