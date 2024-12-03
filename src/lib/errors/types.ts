export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

export class ImageGenerationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'IMAGE_GENERATION_ERROR', 500, details);
  }
}

export class ApiError extends AppError {
  constructor(message: string, statusCode: number = 500, details?: unknown) {
    super(message, 'API_ERROR', statusCode, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTH_ERROR', 401);
  }
}