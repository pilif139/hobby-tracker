import { resolver } from 'hono-openapi';
import z from 'zod';

export const jsonResponse = (schema: z.ZodType, description: string = '') => ({
  description,
  content: {
    'application/json': {
      schema: resolver(schema),
    },
  },
});

export const BaseMessageResponse = z.object({
  message: z.string(),
});

export const BaseErrorResponse = BaseMessageResponse.extend({
  cause: z.string().optional(),
});

// TODO: maybe we don't need this, we can just use BaseMessageResponse and BaseErrorResponse because response validator doesnt handle default values
export const createMessageResponse = (defaultMessage: string) =>
  BaseMessageResponse.extend({ message: z.string().default(defaultMessage) });

export const createErrorResponse = (defaultMessage: string) =>
  BaseErrorResponse.extend({ message: z.string().default(defaultMessage) });

export const NotFoundResponseSchema = createMessageResponse('Not Found');
export const UnauthorizedResponseSchema = createErrorResponse(
  'Credentials are invalid',
);
export const InternalServerErrorResponseSchema = createErrorResponse(
  'Internal server error',
);
export const BadRequestResponseSchema = createErrorResponse('Bad request');
export const ForbiddenResponseSchema = createErrorResponse('Forbidden');

export const NoContentResponseSchema = z.null();

export const ContentTooLargeResponseSchema =
  createErrorResponse('Content too large');
