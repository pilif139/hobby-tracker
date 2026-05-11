import { Hono } from 'hono/quick';
import type { AppContext } from '../types';

const r2Proxy = new Hono<AppContext>();

r2Proxy.get('/*', async (c) => {
  const key = c.req.path.replace('/r2/', '');
  if (!key) {
    return c.notFound();
  }
  c.get('logger').info(`Proxying R2 object: ${key}`);
  const object = await c.env.R2.get(key);
  if (!object) {
    return c.notFound();
  }
  return new Response(object.body, {
    headers: {
      'Content-Type':
        object.httpMetadata?.contentType ?? 'application/octet-stream',
      'Cache-Control': 'public, max-age=3600',
    },
  });
});

export default r2Proxy;
