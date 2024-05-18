import { db } from "@/db/drizzle";
import { accounts, insertAccountSchema } from "@/db/schema";
import { Hono } from "hono";
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';
import { and, eq, inArray } from "drizzle-orm";
import { createId } from '@paralleldrive/cuid2';
import { z } from "zod";

const accountsApi = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    async (ctx) => {
      const auth = getAuth(ctx);
      if (!auth?.userId) return ctx.json({ error: "Unauthorized" }, 401);
      const data = await db
        .select({
          id: accounts.id,
          name: accounts.name,
        })
        .from(accounts)
        .where(eq(accounts.userId, auth.userId));
      return ctx.json({
        data
      })
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertAccountSchema.pick({ name: true })),
    async (ctx) => {
      const auth = getAuth(ctx);
      if (!auth?.userId) return ctx.json({ error: "Unauthorized" }, 401);
      const values = ctx.req.valid("json");
      const [data] = await db.insert(accounts).values({
        id: createId(),
        userId: auth.userId,
        ...values
      }).returning();
      return ctx.json({
        data
      })
    }
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator("json", z.object({
      ids: z.array(z.string())
    })),
    async (ctx) => {
      const auth = getAuth(ctx);
      if (!auth?.userId) return ctx.json({ error: "Unauthorized" }, 401);
      const { ids } = ctx.req.valid("json");
      const data = await db.delete(accounts).where(
        and(
          eq(accounts.userId, auth.userId),
          inArray(accounts.id, ids)
        )
      ).returning({
        id: accounts.id
      });
      return ctx.json({
        data
      })
    }
  )
  .get(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({
      id: z.string().optional()
    })),
    async (ctx) => {
      const auth = getAuth(ctx);
      if (!auth?.userId) return ctx.json({ error: "Unauthorized" }, 401);
      const { id } = ctx.req.valid("param");
      if (!id) return ctx.json({ error: "Id missing" }, 400);
      const [data] = await db
      .select({
        id: accounts.id,
        name: accounts.name,
      })
      .from(accounts)
      .where(
        and(
          eq(accounts.userId, auth.userId),
          eq(accounts.id, id)
        )
      );
      if (!data) return ctx.json({ error: "Not found" }, 404);
      return ctx.json({
        data
      })
    }
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({
      id: z.string().optional()
    })),
    zValidator("json", insertAccountSchema.pick({ name: true })),
    async (ctx) => {
      const auth = getAuth(ctx);
      if (!auth?.userId) return ctx.json({ error: "Unauthorized" }, 401);
      const { id } = ctx.req.valid("param");
      if (!id) return ctx.json({ error: "Id missing" }, 400);
      const values = ctx.req.valid("json");
      const [data] = await db
        .update(accounts)
        .set(values)
        .where(
          and(
            eq(accounts.userId, auth.userId),
            eq(accounts.id, id)
          )
        ).returning({
          id: accounts.id
        });
      if (!data) return ctx.json({ error: "Not found" }, 404);
      return ctx.json({
        data
      })
    }
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({
      id: z.string().optional()
    })),
    async (ctx) => {
      const auth = getAuth(ctx);
      if (!auth?.userId) return ctx.json({ error: "Unauthorized" }, 401);
      const { id } = ctx.req.valid("param");
      if (!id) return ctx.json({ error: "Id missing" }, 400);
      const [data] = await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.userId, auth.userId),
            eq(accounts.id, id)
          )
        ).returning({
          id: accounts.id
        });
      if (!data) return ctx.json({ error: "Not found" }, 404);
      return ctx.json({
        data
      })
    }
  );

export default accountsApi;