import { debounce, throttle } from './utils';

// Debounce prompt analysis to reduce API calls
export const debouncedAnalyzePrompt = debounce(
  async (prompt: string) => {
    // Implementation from promptAnalysis.ts
  },
  500
);

// Throttle image generation to prevent spam
export const throttledGenerateImage = throttle(
  async (options: any) => {
    // Implementation from imageGeneration.ts
  },
  1000
);

// Preload common assets
export const preloadAssets = () => {
  const assets = [
    '/icons/logo.svg',
    // Add other common assets
  ];

  assets.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = url.endsWith('.svg') ? 'image' : 'fetch';
    link.href = url;
    document.head.appendChild(link);
  });
};

// Monitor performance metrics
export const performanceMonitor = {
  marks: new Map<string, number>(),

  start: (label: string) => {
    performanceMonitor.marks.set(label, performance.now());
  },

  end: (label: string): number | null => {
    const start = performanceMonitor.marks.get(label);
    if (!start) return null;
    
    const duration = performance.now() - start;
    performanceMonitor.marks.delete(label);
    return duration;
  },

  measure: async (label: string, fn: () => Promise<any>) => {
    performanceMonitor.start(label);
    const result = await fn();
    const duration = performanceMonitor.end(label);
    return { result, duration };
  }
};