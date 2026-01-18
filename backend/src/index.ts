import { D1Database } from '@cloudflare/workers-types';
import { Hono } from 'hono';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{
  Bindings: Bindings;
}>();

app.get('/', (c) => {
  return c.text('Hello hono!');
});

export default {
  port: 3000,
  fetch: app.fetch,
};
