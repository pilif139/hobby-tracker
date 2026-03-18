import z from 'zod';

export const BaseMessageResponse = z.object({
  message: z.string(),
});

export const BaseErrorResponse = BaseMessageResponse.extend({
  cause: z.string().optional(),
});

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
