import { Hono } from 'hono/quick';
import { describeRoute, validator } from 'hono-openapi';
import z from 'zod';
import {
  createHobbySchema,
  HobbyResponseSchema,
  UserHobbyResponseSchema,
} from './hobby.dto';
import {
  BaseMessageResponse,
  NotFoundResponseSchema,
  jsonResponse,
} from '@/src/lib/openAPI.types';
import type { AppContext } from '@/src/types';

const hobbyController = new Hono<AppContext>();

hobbyController.get(
  '/',
  describeRoute({
    tags: ['Hobby', 'Search'],
    responses: {
      200: jsonResponse(z.array(HobbyResponseSchema), 'Search Results'),
    },
  }),
  validator(
    'query',
    z.object({
      search: z.string().optional(),
      offset: z.number().optional(),
      limit: z.number().optional(),
    }),
  ),
  async (c) => {
    const hobbyService = c.get('services').hobby;
    const { search, offset, limit } = c.req.valid('query');
    if (!search || search.trim() === '') {
      return c.json([]);
    }
    const hobbies = await hobbyService.search(search, offset, limit);

    return c.json(hobbies);
  },
);

hobbyController.get(
  '/user/:userId',
  describeRoute({
    tags: ['Hobby', 'Get By User'],
    responses: {
      200: jsonResponse(z.array(UserHobbyResponseSchema), 'User Hobbies'),
    },
  }),
  validator('param', z.object({ userId: z.string() })),
  async (c) => {
    const hobbyService = c.get('services').hobby;
    const userId = c.req.valid('param').userId;
    const hobbies = await hobbyService.getByUserId(userId);

    return c.json(hobbies);
  },
);

hobbyController.get(
  '/:id',
  describeRoute({
    tags: ['Hobby', 'Get By Id'],
    responses: {
      200: jsonResponse(HobbyResponseSchema, 'Hobby'),
      404: jsonResponse(NotFoundResponseSchema, 'Not Found'),
    },
  }),
  validator('param', z.object({ id: z.string() })),
  async (c) => {
    const hobbyService = c.get('services').hobby;
    const id = c.req.valid('param').id;
    const hobby = await hobbyService.getById(id);
    if (!hobby) {
      return c.json({ message: 'Hobby not found' }, 404);
    }
    return c.json(hobby);
  },
);

hobbyController.post(
  '/',
  describeRoute({
    tags: ['Hobby', 'Create New'],
    responses: {
      201: jsonResponse(HobbyResponseSchema, 'Created Hobby'),
    },
  }),
  validator('json', createHobbySchema),
  async (c) => {
    const body = c.req.valid('json');
    const hobbyService = c.get('services').hobby;
    const hobby = await hobbyService.create(body);

    return c.json(hobby, 201);
  },
);

hobbyController.post(
  '/add-to-profile/:hobbyId',
  describeRoute({
    tags: ['Hobby', 'Add'],
    responses: {
      200: jsonResponse(z.object({ message: z.string() }), 'Added'),
      404: jsonResponse(NotFoundResponseSchema, 'Not Found'),
      409: jsonResponse(BaseMessageResponse, 'Conflict'),
    },
  }),
  validator('param', z.object({ hobbyId: z.string() })),
  async (c) => {
    const hobbyService = c.get('services').hobby;
    const hobbyId = c.req.valid('param').hobbyId;
    const userId = c.get('userId');

    const result = await hobbyService.addToProfile(userId, hobbyId);
    if ('error' in result) {
      if (result.error === 'Hobby not found') {
        return c.json({ message: 'Hobby not found' }, 404);
      }
      return c.json({ message: 'Hobby already in profile' }, 409);
    }

    return c.json({ message: 'Hobby added to profile' });
  },
);

hobbyController.delete(
  '/remove-from-profile/:hobbyId',
  describeRoute({
    tags: ['Hobby', 'Remove'],
    responses: {
      200: jsonResponse(z.object({ message: z.string() }), 'Removed'),
      404: jsonResponse(BaseMessageResponse, 'Not Found'),
      400: jsonResponse(BaseMessageResponse, 'Bad Request'),
    },
  }),
  validator('param', z.object({ hobbyId: z.string() })),
  async (c) => {
    const hobbyService = c.get('services').hobby;
    const hobbyId = c.req.valid('param').hobbyId;
    const userId = c.get('userId');

    const result = await hobbyService.removeFromProfile(userId, hobbyId);
    if ('error' in result) {
      if (result.error === 'Hobby not found') {
        return c.json({ message: 'Hobby not found' }, 404);
      }
      return c.json({ message: 'Hobby not in profile' }, 400);
    }

    return c.json({ message: 'Hobby removed from profile' });
  },
);
// .post(
//   '/upload-image/:hobbyId',
//   describeRoute({
//     tags: ['Hobby', 'Upload New Image'],
//     responses: {
//       200: jsonResponse(z.object({ message: z.string() }), 'Uploaded'),
//     },
//   }),
//   validator('param', z.object({ hobbyId: z.string() })),
//   validator('form', z.object({ image: z.instanceof(File) })),
//   (c) => {
//     c.json({});
//   },
// );

export default hobbyController;
