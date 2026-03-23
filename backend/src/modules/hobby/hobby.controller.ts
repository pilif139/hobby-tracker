import { Hono } from 'hono';
import { openApi } from 'hono-zod-openapi';
import z from 'zod';
import {
  createHobbySchema,
  HobbyResponseSchema,
  UserHobbyResponseSchema,
} from './hobby.dto';
import {
  BaseMessageResponse,
  NotFoundResponseSchema,
} from '@/src/lib/openAPI.types';
import type { AppContext } from '@/src/types';

const hobbyController = new Hono<AppContext>()
  .get(
    '/',
    openApi({
      tags: ['Hobby', 'Search'],
      request: {
        query: z.object({
          search: z.string().optional(),
          offset: z.number().optional(),
          limit: z.number().optional(),
        }),
      },
      responses: {
        200: z.array(HobbyResponseSchema),
      },
    }),
    async (c) => {
      const hobbyService = c.get('services').hobby;
      const { search, offset, limit } = c.req.valid('query');
      if (!search || search.trim() === '') {
        return c.var.res([]);
      }
      const hobbies = await hobbyService.search(search, offset, limit);

      return c.var.res(hobbies);
    },
  )
  .get(
    '/user/:userId',
    openApi({
      tags: ['Hobby', 'Get By User'],
      request: {
        param: z.object({
          userId: z.string(),
        }),
      },
      responses: {
        200: z.array(UserHobbyResponseSchema),
      },
    }),
    async (c) => {
      const hobbyService = c.get('services').hobby;
      const userId = c.req.valid('param').userId;
      const hobbies = await hobbyService.getByUserId(userId);

      return c.var.res(hobbies);
    },
  )
  .get(
    '/:id',
    openApi({
      tags: ['Hobby', 'Get By Id'],
      request: {
        param: z.object({
          id: z.string(),
        }),
      },
      responses: {
        200: HobbyResponseSchema,
        404: NotFoundResponseSchema,
      },
    }),
    async (c) => {
      const hobbyService = c.get('services').hobby;
      const id = c.req.valid('param').id;
      const hobby = await hobbyService.getById(id);
      if (!hobby) {
        return c.var.res(404, { message: 'Hobby not found' });
      }
      return c.var.res(hobby);
    },
  )
  .post(
    '/',
    openApi({
      tags: ['Hobby', 'Create New'],
      request: {
        json: createHobbySchema,
      },
      responses: {
        201: HobbyResponseSchema,
      },
    }),
    async (c) => {
      const body = c.req.valid('json');
      const hobbyService = c.get('services').hobby;
      const hobby = await hobbyService.create(body);

      return c.var.res(201, hobby);
    },
  )
  .post(
    '/add-to-profile/:hobbyId',
    openApi({
      tags: ['Hobby', 'Add'],
      request: {
        param: z.object({
          hobbyId: z.string(),
        }),
      },
      responses: {
        200: z.object({
          message: z.string(),
        }),
        404: NotFoundResponseSchema,
        409: BaseMessageResponse,
      },
    }),
    async (c) => {
      const hobbyService = c.get('services').hobby;
      const hobbyId = c.req.valid('param').hobbyId;
      const userId = c.get('userId');

      const result = await hobbyService.addToProfile(userId, hobbyId);
      if ('error' in result) {
        if (result.error === 'Hobby not found') {
          return c.var.res(404, { message: 'Hobby not found' });
        }
        return c.var.res(409, { message: 'Hobby already in profile' });
      }

      return c.var.res({ message: 'Hobby added to profile' });
    },
  )
  .delete(
    '/remove-from-profile/:hobbyId',
    openApi({
      tags: ['Hobby', 'Remove'],
      request: {
        param: z.object({
          hobbyId: z.string(),
        }),
      },
      responses: {
        200: z.object({
          message: z.string(),
        }),
        404: BaseMessageResponse,
        400: BaseMessageResponse,
      },
    }),
    async (c) => {
      const hobbyService = c.get('services').hobby;
      const hobbyId = c.req.valid('param').hobbyId;
      const userId = c.get('userId');

      const result = await hobbyService.removeFromProfile(userId, hobbyId);
      if ('error' in result) {
        if (result.error === 'Hobby not found') {
          return c.var.res(404, { message: 'Hobby not found' });
        }
        return c.var.res(400, { message: 'Hobby not in profile' });
      }

      return c.var.res({ message: 'Hobby removed from profile' });
    },
  )
  .post(
    '/upload-image/:hobbyId',
    openApi({
      tags: ['Hobby', 'Upload New Image'],
      request: {
        param: z.object({
          hobbyId: z.string(),
        }),
        form: z.object({
          image: z.instanceof(File),
        }),
      },
      responses: {
        200: z.object({
          message: z.string(),
        }),
      },
    }),
    async (c) => {},
  );

export default hobbyController;
