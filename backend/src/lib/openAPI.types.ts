import { resolver } from 'hono-openapi';
import z from 'zod';

export const jsonResponse = (
  schema: z.ZodType,
  description: string = '',
  example?: unknown,
) => ({
  description,
  content: {
    'application/json': {
      schema: resolver(schema),
      ...(example ? { example } : {}),
    },
  },
});

export const BaseMessageResponse = z.object({
  message: z.string(),
});

export const BaseErrorResponse = BaseMessageResponse.extend({
  cause: z.string().optional(),
});

export const response = {
  /** 200 OK - Success response with your schema */
  success: (schema: z.ZodType, description = 'Success') =>
    jsonResponse(schema, description),

  /** 201 Created - Resource created successfully */
  created: (schema: z.ZodType, description = 'Created') =>
    jsonResponse(schema, description),

  /** 204 No Content - Success with empty body */
  noContent: (description = 'No Content') => ({ description }),

  /** 400 Bad Request - Invalid input data */
  badRequest: (
    description = 'Bad Request',
    example = { message: 'Bad request' },
  ) => jsonResponse(BaseErrorResponse, description, example),

  /** 401 Unauthorized - Authentication required or failed */
  unauthorized: (
    description = 'Unauthorized',
    example = { message: 'Credentials are invalid' },
  ) => jsonResponse(BaseErrorResponse, description, example),

  /** 403 Forbidden - Authenticated but not permitted */
  forbidden: (description = 'Forbidden', example = { message: 'Forbidden' }) =>
    jsonResponse(BaseErrorResponse, description, example),

  /** 404 Not Found - Resource does not exist */
  notFound: (description = 'Not Found', example = { message: 'Not Found' }) =>
    jsonResponse(BaseMessageResponse, description, example),

  /** 409 Conflict - Resource conflict (e.g., already exists) */
  conflict: (description = 'Conflict', example = { message: 'Conflict' }) =>
    jsonResponse(BaseMessageResponse, description, example),

  /** 413 Content Too Large - Request entity too large */
  contentTooLarge: (
    description = 'Content Too Large',
    example = { message: 'Content too large' },
  ) => jsonResponse(BaseErrorResponse, description, example),

  /** 500 Internal Server Error - Unexpected server error */
  serverError: (
    description = 'Internal Server Error',
    example = { message: 'Internal server error' },
  ) => jsonResponse(BaseErrorResponse, description, example),
};

interface FileArrayOptions {
  max: number;
  min?: number;
}

export const fileArray = ({ max, min = 0 }: FileArrayOptions) =>
  z.preprocess(
    (val) => {
      if (val === null || val === undefined) {
        return undefined;
      }

      if (Array.isArray(val)) {
        return val.every((v) => v instanceof File) ? val : undefined;
      }

      if (val instanceof File) {
        return [val];
      }

      return undefined;
    },
    z.array(z.instanceof(File)).max(max).min(min),
  );
