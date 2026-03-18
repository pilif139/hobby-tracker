import { Hono } from 'hono';
import { openApi } from 'hono-zod-openapi';
import z from 'zod';
import {
  createHobbySchema,
  HobbyResponseSchema,
  updateHobbySchema,
} from './hobby.dto';
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
    '/:id',
    openApi({
      tags: ['Hobby', 'Get By Id'],
      request: {
        param: z.uuid(),
      },
      responses: {
        200: HobbyResponseSchema,
      },
    }),
    async (c) => {},
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
    '/uploadImage/:hobbyId',
    openApi({
      tags: ['Hobby', 'Upload New Image'],
      request: {
        param: z.uuid(),
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
  )
  .patch(
    '/:id',
    openApi({
      tags: ['Hobby', 'Update Existing'],
      request: {
        param: z.uuid(),
        json: updateHobbySchema,
      },
      responses: {
        200: HobbyResponseSchema,
      },
    }),
    async (c) => {},
  );

export default hobbyController;
