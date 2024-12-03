import { toast } from 'sonner';
import { AppError, ValidationError, ImageGenerationError, ApiError, AuthenticationError } from './types';

export function handleError(error: unknown): void {
  console.error('Error occurred:', error);

  if (error instanceof ValidationError) {
    toast.error('שגיאת אימות', {
      description: error.message,
      duration: 5000,
    });
    return;
  }

  if (error instanceof ImageGenerationError) {
    toast.error('שגיאה ביצירת תמונה', {
      description: error.message,
      duration: 5000,
    });
    return;
  }

  if (error instanceof ApiError) {
    if (error.statusCode === 429) {
      toast.error('חריגה ממגבלת בקשות', {
        description: 'נא לנסות שוב מאוחר יותר',
        duration: 5000,
      });
      return;
    }
    
    toast.error('שגיאת שרת', {
      description: error.message,
      duration: 5000,
    });
    return;
  }

  if (error instanceof AuthenticationError) {
    toast.error('נדרשת התחברות', {
      description: error.message,
      duration: 5000,
    });
    return;
  }

  // Fallback for unknown errors
  toast.error('שגיאה לא צפויה', {
    description: error instanceof Error ? error.message : 'אירעה שגיאה, נא לנסות שוב',
    duration: 5000,
  });
}

export function withErrorHandling<T>(fn: () => Promise<T>): Promise<T> {
  return fn().catch(error => {
    handleError(error);
    throw error;
  });
}