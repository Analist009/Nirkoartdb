import { toast } from 'sonner';

export class OpenAIError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = 'OpenAIError';
    this.handleError();
  }

  private handleError() {
    let errorMessage = 'שגיאה ביצירת התמונה';

    if (this.status === 401) {
      errorMessage = 'מפתח API לא תקף. אנא בדוק את המפתח שלך ונסה שוב.';
    } else if (this.status === 429) {
      errorMessage = 'הגעת למגבלת הבקשות. אנא נסה שוב מאוחר יותר.';
    } else if (this.status === 400) {
      errorMessage = 'הפרומפט לא תקין או ארוך מדי. אנא נסה פרומפט אחר.';
    }

    toast.error('שגיאה', {
      description: errorMessage,
      duration: 5000
    });
  }
}

export class PromptAnalysisError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'PromptAnalysisError';
    this.handleError();
  }

  private handleError() {
    toast.error('שגיאה בניתוח הפרומפט', {
      description: this.message,
      duration: 5000
    });
  }
}

export class ImageGenerationError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'ImageGenerationError';
    this.handleError();
  }

  private handleError() {
    toast.error('שגיאה ביצירת תמונה', {
      description: this.message,
      duration: 5000
    });
  }
}

export class StorageError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'StorageError';
    this.handleError();
  }

  private handleError() {
    toast.error('שגיאה בשמירה', {
      description: 'לא ניתן לשמור את התמונה כרגע. אנא נסה שוב מאוחר יותר.',
      duration: 5000
    });
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof OpenAIError) {
    if (error.status === 401) {
      return 'מפתח API לא תקף. אנא בדוק את המפתח שלך ונסה שוב.';
    }
    if (error.status === 429) {
      return 'הגעת למגבלת הבקשות. אנא נסה שוב מאוחר יותר.';
    }
    return 'שגיאה ביצירת התמונה. אנא נסה שוב.';
  }
  
  if (error instanceof PromptAnalysisError) {
    return 'שגיאה בניתוח הפרומפט. אנא נסה שוב.';
  }
  
  if (error instanceof ImageGenerationError) {
    return error.message;
  }
  
  if (error instanceof StorageError) {
    return 'שגיאה בשמירת התמונה. אנא נסה שוב.';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'אירעה שגיאה לא צפויה. אנא נסה שוב.';
}