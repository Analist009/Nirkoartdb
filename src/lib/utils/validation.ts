import { z } from 'zod';
import { ValidationError } from '../errors/types';

export async function validateData<T>(schema: z.ZodSchema<T>, data: unknown): Promise<T> {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      throw new ValidationError('שגיאה באימות נתונים', details);
    }
    throw error;
  }
}

export function createValidator<T>(schema: z.ZodSchema<T>) {
  return (data: unknown) => validateData(schema, data);
}