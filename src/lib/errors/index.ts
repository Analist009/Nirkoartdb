import { toast } from 'sonner';

export class BaseError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = this.constructor.name;
  }

  protected showToast(description?: string) {
    toast.error(this.message, {
      description,
      duration: 5000
    });
  }
}

export class OpenAIError extends BaseError {
  constructor(message: string, code?: string, status?: number) {
    super(message, code, status);
    this.handleError();
  }

  private handleError() {
    let description = 'שגיאה ביצירת התמונה';

    if (this.status === 401) {
      description = 'מפתח API לא תקף. אנא בדוק את המפתח שלך ונסה שוב.';
    } else if (this.status === 429) {
      description = 'הגעת למגבלת הבקשות. אנא נסה שוב מאוחר יותר.';
    } else if (this.status === 400) {
      description = 'הפרומפט לא תקין או ארוך מדי. אנא נסה פרומפט אחר.';
    }

    this.showToast(description);
  }
}

export class DatabaseError extends BaseError {
  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.handleError();
  }

  private handleError() {
    this.showToast('שגיאה בגישה למסד הנתונים');
  }
}

export class ValidationError extends BaseError {
  constructor(message: string, public readonly errors: Record<string, string[]>) {
    super(message);
    this.handleError();
  }

  private handleError() {
    this.showToast(Object.values(this.errors).flat().join(', '));
  }
}

export class AuthenticationError extends BaseError {
  constructor(message: string) {
    super(message);
    this.handleError();
  }

  private handleError() {
    this.showToast('נדרשת התחברות לביצוע פעולה זו');
  }
}

export class StorageError extends BaseError {
  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.handleError();
  }

  private handleError() {
    this.showToast('שגיאה בשמירת הקובץ');
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof BaseError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'אירעה שגיאה לא צפויה';
}