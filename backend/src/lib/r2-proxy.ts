import { cache } from 'hono/cache';
import { Hono } from 'hono/quick';
import type { AppContext } from '../types';

const r2Proxy = new Hono<AppContext>();

r2Proxy.get(
  '/*',
  cache({
    cacheControl: 'public, max-age=3600',
    cacheName: (c) => c.req.path.replace('/r2/', ''),
  }),
  async (c) => {
    const key = c.req.path.replace('/r2/', '');
    if (!key) {
      return c.notFound();
    }

    c.get('logger').info(`Proxying R2 object: ${key}`);
    const object = await c.env.R2.get(key);
    if (!object) {
      return c.notFound();
    }

    c.header(
      'Content-Type',
      object.httpMetadata?.contentType ?? 'application/octet-stream',
    );

    return c.body(object.body);
  },
);

export default r2Proxy;
