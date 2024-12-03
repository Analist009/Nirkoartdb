import { Analytics } from '@vercel/analytics/react';
import { useSession } from './session';

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

export function trackEvent(event: AnalyticsEvent) {
  const session = useSession.getState();
  
  if (Analytics) {
    Analytics.track(event.name, {
      ...event.properties,
      userId: session.userId,
      timestamp: new Date().toISOString()
    });
  }
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Analytics />
      {children}
    </>
  );
}