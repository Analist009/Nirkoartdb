export function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function ensureValidDate(date: Date | string): Date {
  return date instanceof Date ? date : new Date(date);
}