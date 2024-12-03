export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

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
  }
};