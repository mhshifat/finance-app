import { db } from "@/db/drizzle";
import { categories, insertCategoriesSchema } from "@/db/schema";
import { Hono } from "hono";
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';
import { and, eq, inArray } from "drizzle-orm";
import { createId } from '@paralleldrive/cuid2';
import { z } from "zod";

const categoriesApi = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    async (ctx) => {
      const auth = getAuth(ctx);
      if (!auth?.userId) return ctx.json({ error: "Unauthorized" }, 401);
      const data = await db
        .select({
          id: categories.id,
          name: categories.name,
        })
        .from(categories)
        .where(eq(categories.userId, auth.userId));
      return ctx.json({
        data
      })
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertCategoriesSchema.pick({ name: true })),
    async (ctx) => {
      const auth = getAuth(ctx);
      if (!auth?.userId) return ctx.json({ error: "Unauthorized" }, 401);
      const values = ctx.req.valid("json");
      const [data] = await db.insert(categories).values({
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
      const data = await db.delete(categories).where(
        and(
          eq(categories.userId, auth.userId),
          inArray(categories.id, ids)
        )
      ).returning({
        id: categories.id
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
        id: categories.id,
        name: categories.name,
      })
      .from(categories)
      .where(
        and(
          eq(categories.userId, auth.userId),
          eq(categories.id, id)
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
    zValidator("json", insertCategoriesSchema.pick({ name: true })),
    async (ctx) => {
      const auth = getAuth(ctx);
      if (!auth?.userId) return ctx.json({ error: "Unauthorized" }, 401);
      const { id } = ctx.req.valid("param");
      if (!id) return ctx.json({ error: "Id missing" }, 400);
      const values = ctx.req.valid("json");
      const [data] = await db
        .update(categories)
        .set(values)
        .where(
          and(
            eq(categories.userId, auth.userId),
            eq(categories.id, id)
          )
        ).returning({
          id: categories.id
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
        .delete(categories)
        .where(
          and(
            eq(categories.userId, auth.userId),
            eq(categories.id, id)
          )
        ).returning({
          id: categories.id
        });
      if (!data) return ctx.json({ error: "Not found" }, 404);
      return ctx.json({
        data
      })
    }
  );

export default categoriesApi;