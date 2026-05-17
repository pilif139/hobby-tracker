import type { Context } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { HTTPException } from 'hono/http-exception';
import { Hono } from 'hono/quick';
import { describeRoute, validator } from 'hono-openapi';
import z from 'zod';
import {
  createHobbySessionDto,
  hobbySessionResponseSchema,
  hobbySessionListResponseSchema,
  hobbySessionQueryDto,
  updateHobbySessionDto,
} from './hobby-session.dto';
import { TooManySessionImagesException } from './hobby-session.service';
import {
  parseDateFilter,
  FILTER_MIN_DATE,
  getDateErrorMessage,
} from '@/src/lib/date-filter';
import { InvalidImageFileExtensionException } from '@/src/lib/image';
import { jsonResponse, response } from '@/src/lib/openAPI.types';
import type { AppContext } from '@/src/types';

const hobbySessionController = new Hono<AppContext>();

hobbySessionController.get(
  '/user/:userId',
  describeRoute({
    tags: ['Hobby Session'],
    responses: {
      200: jsonResponse(
        hobbySessionListResponseSchema,
        'User Hobby Sessions with stats',
      ),
      403: response.forbidden(),
    },
  }),
  validator('param', z.object({ userId: z.string() })),
  validator('query', hobbySessionQueryDto),
  async (c) => {
    const userId = c.req.valid('param').userId;
    const currentUserId = c.get('userId');
    const maxFilterDate = new Date();

    if (userId !== currentUserId) {
      throw new HTTPException(403, { message: 'Unauthorized user' });
    }

    const hobbySessionService = c.get('services').hobbySession;
    const { limit = 10, offset = 0, from, to } = c.req.valid('query');
    const parsedFrom = parseDateFilter(from, {
      minDate: FILTER_MIN_DATE,
      maxDate: maxFilterDate,
    });
    const parsedTo = parseDateFilter(to, {
      minDate: FILTER_MIN_DATE,
      maxDate: maxFilterDate,
    });

    if (parsedFrom.error) {
      throw new HTTPException(400, {
        message: getDateErrorMessage('from', parsedFrom.error),
      });
    }

    if (parsedTo.error) {
      throw new HTTPException(400, {
        message: getDateErrorMessage('to', parsedTo.error),
      });
    }

    if (
      parsedFrom.date &&
      parsedTo.date &&
      parsedFrom.date.getTime() > parsedTo.date.getTime()
    ) {
      throw new HTTPException(400, {
        message: 'from must be before or equal to to',
      });
    }

    const result = await hobbySessionService.findByUserIdPaginatedWithStats(
      userId,
      {
        limit,
        offset,
        from: parsedFrom.date ?? undefined,
        to: parsedTo.date ?? undefined,
      },
    );

    return c.json(result);
  },
);

hobbySessionController.get(
  '/hobby/:hobbyId',
  describeRoute({
    tags: ['Hobby Session'],
    responses: {
      200: jsonResponse(
        hobbySessionListResponseSchema,
        'Current user sessions for a hobby with stats',
      ),
    },
  }),
  validator('param', z.object({ hobbyId: z.string() })),
  validator('query', hobbySessionQueryDto),
  async (c) => {
    const hobbyId = c.req.valid('param').hobbyId;
    const userId = c.get('userId');
    const maxFilterDate = new Date();
    const { from, to } = c.req.valid('query');
    const parsedFrom = parseDateFilter(from, {
      minDate: FILTER_MIN_DATE,
      maxDate: maxFilterDate,
    });
    const parsedTo = parseDateFilter(to, {
      minDate: FILTER_MIN_DATE,
      maxDate: maxFilterDate,
    });

    if (parsedFrom.error) {
      throw new HTTPException(400, {
        message: getDateErrorMessage('from', parsedFrom.error),
      });
    }

    if (parsedTo.error) {
      throw new HTTPException(400, {
        message: getDateErrorMessage('to', parsedTo.error),
      });
    }

    if (
      parsedFrom.date &&
      parsedTo.date &&
      parsedFrom.date.getTime() > parsedTo.date.getTime()
    ) {
      throw new HTTPException(400, {
        message: 'from must be before or equal to to',
      });
    }

    const hobbySessionService = c.get('services').hobbySession;

    const result = await hobbySessionService.findByHobbyIdAndUserId(
      hobbyId,
      userId,
      {
        from: parsedFrom.date ?? undefined,
        to: parsedTo.date ?? undefined,
      },
    );
    return c.json(result);
  },
);

hobbySessionController.get(
  '/:id',
  describeRoute({
    tags: ['Hobby Session'],
    responses: {
      200: jsonResponse(hobbySessionResponseSchema, 'Hobby Session'),
      403: response.forbidden(),
      404: response.notFound(),
    },
  }),
  validator('param', z.object({ id: z.string() })),
  async (c) => {
    const id = c.req.valid('param').id;
    const userId = c.get('userId');
    const hobbySessionService = c.get('services').hobbySession;

    const session = await hobbySessionService.getById(id);
    if (!session) {
      throw new HTTPException(404, { message: 'Hobby session not found' });
    }

    if (session.userId !== userId) {
      throw new HTTPException(403, { message: 'Unauthorized user' });
    }

    return c.json(session);
  },
);

hobbySessionController.post(
  '/',
  describeRoute({
    tags: ['Hobby Session'],
    responses: {
      201: response.created(hobbySessionResponseSchema),
      400: response.badRequest(),
      413: response.contentTooLarge(),
    },
  }),
  bodyLimit({
    maxSize: 20 * 1024 * 1024,
    onError: (c) => {
      (c as Context<AppContext>)
        .get('logger')
        .error('Body limit error: Payload too large');
      throw new HTTPException(413, {
        message: 'Request body is too large. Maximum size is 20MB.',
      });
    },
  }),
  validator('form', createHobbySessionDto),
  async (c) => {
    const { hobbyId, startTime, endTime, notes, images } = c.req.valid('form');
    const userId = c.get('userId');
    const hobbySessionService = c.get('services').hobbySession;

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end.getTime() <= start.getTime()) {
      throw new HTTPException(400, {
        message: 'endTime must be after startTime',
      });
    }

    try {
      const hobbySession = await hobbySessionService.create({
        startTime: start,
        endTime: end,
        notes,
        hobbyId,
        userId,
        images,
      });

      return c.json(hobbySession, 201);
    } catch (error) {
      if (error instanceof InvalidImageFileExtensionException) {
        throw new HTTPException(400, { message: error.message });
      }
      throw error;
    }
  },
);

hobbySessionController.patch(
  '/:id',
  describeRoute({
    tags: ['Hobby Session'],
    responses: {
      200: jsonResponse(hobbySessionResponseSchema, 'Updated session'),
      400: response.badRequest(),
      403: response.forbidden(),
      404: response.notFound(),
      413: response.contentTooLarge(),
    },
  }),
  bodyLimit({
    maxSize: 20 * 1024 * 1024,
    onError: (c) => {
      (c as Context<AppContext>)
        .get('logger')
        .error('Body limit error: Payload too large');
      throw new HTTPException(413, {
        message: 'Request body is too large. Maximum size is 20MB.',
      });
    },
  }),
  validator('param', z.object({ id: z.string() })),
  validator('form', updateHobbySessionDto),
  async (c) => {
    const id = c.req.valid('param').id;
    const body = c.req.valid('form');
    const userId = c.get('userId');
    const hobbySessionService = c.get('services').hobbySession;

    const existingSession = await hobbySessionService.findById(id);
    if (!existingSession) {
      throw new HTTPException(404, { message: 'Hobby session not found' });
    }

    if (existingSession.userId !== userId) {
      throw new HTTPException(403, { message: 'Unauthorized user' });
    }

    const nextStart = body.startTime
      ? new Date(body.startTime)
      : existingSession.startTime;
    const nextEnd = body.endTime
      ? new Date(body.endTime)
      : existingSession.endTime;

    if (nextEnd.getTime() <= nextStart.getTime()) {
      throw new HTTPException(400, {
        message: 'endTime must be after startTime',
      });
    }

    try {
      const updated = await hobbySessionService.update(id, userId, {
        hobbyId: body.hobbyId,
        startTime: body.startTime ? new Date(body.startTime) : undefined,
        endTime: body.endTime ? new Date(body.endTime) : undefined,
        notes: body.notes,
        newImages: body.images,
        deletedImageKeys: body.deletedImageKeys,
      });

      return c.json(updated);
    } catch (error) {
      if (
        error instanceof TooManySessionImagesException ||
        error instanceof InvalidImageFileExtensionException
      ) {
        throw new HTTPException(400, { message: error.message });
      }
      throw error;
    }
  },
);

hobbySessionController.delete(
  '/:id',
  describeRoute({
    tags: ['Hobby Session'],
    responses: {
      204: response.noContent(),
      403: response.forbidden(),
      404: response.notFound(),
    },
  }),
  validator('param', z.object({ id: z.string() })),
  async (c) => {
    const id = c.req.valid('param').id;
    const userId = c.get('userId');
    const hobbySessionService = c.get('services').hobbySession;

    const existingSession = await hobbySessionService.findById(id);
    if (!existingSession) {
      throw new HTTPException(404, { message: 'Hobby session not found' });
    }

    if (existingSession.userId !== userId) {
      throw new HTTPException(403, { message: 'Unauthorized user' });
    }

    await hobbySessionService.delete(id);
    return c.body(null, 204);
  },
);

export default hobbySessionController;
