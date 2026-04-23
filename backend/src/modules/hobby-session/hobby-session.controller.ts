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
import {
  parseDateFilter,
  FILTER_MIN_DATE,
  getDateErrorMessage,
} from '@/src/lib/date-filter';
import {
  BadRequestResponseSchema,
  ForbiddenResponseSchema,
  NotFoundResponseSchema,
  jsonResponse,
} from '@/src/lib/openAPI.types';
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
      403: jsonResponse(ForbiddenResponseSchema, 'Forbidden'),
    },
  }),
  validator('param', z.object({ userId: z.string() })),
  validator('query', hobbySessionQueryDto),
  async (c) => {
    const userId = c.req.valid('param').userId;
    const currentUserId = c.get('userId');
    const maxFilterDate = new Date();

    if (userId !== currentUserId) {
      return c.json({ message: 'Unauthorized user' }, 403);
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
      return c.json(
        { message: getDateErrorMessage('from', parsedFrom.error) },
        400,
      );
    }

    if (parsedTo.error) {
      return c.json(
        { message: getDateErrorMessage('to', parsedTo.error) },
        400,
      );
    }

    if (
      parsedFrom.date &&
      parsedTo.date &&
      parsedFrom.date.getTime() > parsedTo.date.getTime()
    ) {
      return c.json({ message: 'from must be before or equal to to' }, 400);
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
      return c.json(
        { message: getDateErrorMessage('from', parsedFrom.error) },
        400,
      );
    }

    if (parsedTo.error) {
      return c.json(
        { message: getDateErrorMessage('to', parsedTo.error) },
        400,
      );
    }

    if (
      parsedFrom.date &&
      parsedTo.date &&
      parsedFrom.date.getTime() > parsedTo.date.getTime()
    ) {
      return c.json({ message: 'from must be before or equal to to' }, 400);
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
      403: jsonResponse(ForbiddenResponseSchema, 'Forbidden'),
      404: jsonResponse(NotFoundResponseSchema, 'Not Found'),
    },
  }),
  validator('param', z.object({ id: z.string() })),
  async (c) => {
    const id = c.req.valid('param').id;
    const userId = c.get('userId');
    const hobbySessionService = c.get('services').hobbySession;

    const session = await hobbySessionService.getById(id);
    if (!session) {
      return c.json({ message: 'Hobby session not found' }, 404);
    }

    if (session.userId !== userId) {
      return c.json({ message: 'Unauthorized user' }, 403);
    }

    return c.json(session);
  },
);

hobbySessionController.post(
  '/',
  describeRoute({
    tags: ['Hobby Session'],
    responses: {
      201: jsonResponse(hobbySessionResponseSchema, 'Created session'),
      400: jsonResponse(BadRequestResponseSchema, 'Bad Request'),
    },
  }),
  validator('json', createHobbySessionDto),
  async (c) => {
    const { hobbyId, startTime, endTime, notes } = c.req.valid('json');
    const userId = c.get('userId');
    const hobbySessionService = c.get('services').hobbySession;

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end.getTime() <= start.getTime()) {
      return c.json({ message: 'endTime must be after startTime' }, 400);
    }

    const hobbySession = await hobbySessionService.create({
      startTime: start,
      endTime: end,
      notes,
      hobbyId,
      userId,
    });

    return c.json(hobbySession, 201);
  },
);

hobbySessionController.patch(
  '/:id',
  describeRoute({
    tags: ['Hobby Session'],
    responses: {
      200: jsonResponse(hobbySessionResponseSchema, 'Updated session'),
      400: jsonResponse(BadRequestResponseSchema, 'Bad Request'),
      403: jsonResponse(ForbiddenResponseSchema, 'Forbidden'),
      404: jsonResponse(NotFoundResponseSchema, 'Not Found'),
    },
  }),
  validator('param', z.object({ id: z.string() })),
  validator('json', updateHobbySessionDto),
  async (c) => {
    const id = c.req.valid('param').id;
    const body = c.req.valid('json');
    const userId = c.get('userId');
    const hobbySessionService = c.get('services').hobbySession;

    const existingSession = await hobbySessionService.findById(id);
    if (!existingSession) {
      return c.json({ message: 'Hobby session not found' }, 404);
    }

    if (existingSession.userId !== userId) {
      return c.json({ message: 'Unauthorized user' }, 403);
    }

    const nextStart = body.startTime
      ? new Date(body.startTime)
      : existingSession.startTime;
    const nextEnd = body.endTime
      ? new Date(body.endTime)
      : existingSession.endTime;

    if (nextEnd.getTime() <= nextStart.getTime()) {
      return c.json({ message: 'endTime must be after startTime' }, 400);
    }

    const updated = await hobbySessionService.update(id, {
      hobbyId: body.hobbyId,
      startTime: body.startTime ? new Date(body.startTime) : undefined,
      endTime: body.endTime ? new Date(body.endTime) : undefined,
      notes: body.notes,
    });

    return c.json(updated);
  },
);

hobbySessionController.delete(
  '/:id',
  describeRoute({
    tags: ['Hobby Session'],
    responses: {
      204: { description: 'No Content' },
      403: jsonResponse(ForbiddenResponseSchema, 'Forbidden'),
      404: jsonResponse(NotFoundResponseSchema, 'Not Found'),
    },
  }),
  validator('param', z.object({ id: z.string() })),
  async (c) => {
    const id = c.req.valid('param').id;
    const userId = c.get('userId');
    const hobbySessionService = c.get('services').hobbySession;

    const existingSession = await hobbySessionService.findById(id);
    if (!existingSession) {
      return c.json({ message: 'Hobby session not found' }, 404);
    }

    if (existingSession.userId !== userId) {
      return c.json({ message: 'Unauthorized user' }, 403);
    }

    await hobbySessionService.delete(id);
    return c.body(null, 204);
  },
);

export default hobbySessionController;
