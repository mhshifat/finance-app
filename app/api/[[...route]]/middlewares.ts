import { getAuth } from '@hono/clerk-auth';
import { createMiddleware } from 'hono/factory'

export const isAuth = createMiddleware(async (ctx, next) => {
  const auth = getAuth(ctx);
  if (!auth?.userId) return ctx.json({ error: "Unauthorized" }, 401);
  await next();
})