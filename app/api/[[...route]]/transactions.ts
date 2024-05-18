import { db } from "@/db/drizzle";
import { transactions, insertAccountSchema, accounts, categories, insertTransactionsSchema } from "@/db/schema";
import { Hono } from "hono";
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { createId } from '@paralleldrive/cuid2';
import { z } from "zod";
import { subDays, parse } from 'date-fns';

const transactionsApi = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    zValidator("query", z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    })),
    async (ctx) => {
      const auth = getAuth(ctx);
      if (!auth?.userId) return ctx.json({ error: "Unauthorized" }, 401);
      const { accountId, from, to } = ctx.req.valid("query");

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);
      const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom;
      const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;
      
      const data = await db
        .select({
          id: transactions.id,
          amount: transactions.amount,
          date: transactions.date,
          notes: transactions.notes,
          payee: transactions.payee,
          account: accounts.name,
          accountId: transactions.accountId,
          category: categories.name,
          categoryId: transactions.categoryId,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate),
        ))
        .orderBy(desc(transactions.date));
      
      return ctx.json({
        data
      })
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertTransactionsSchema.omit({ id: true })),
    async (ctx) => {
      const auth = getAuth(ctx);
      if (!auth?.userId) return ctx.json({ error: "Unauthorized" }, 401);
      const values = ctx.req.valid("json");
      const [data] = await db.insert(transactions).values({
        id: createId(),
        ...values
      }).returning();
      return ctx.json({
        data
      })
    }
  )
  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator("json", z.array(insertTransactionsSchema.omit({ id: true }))),
    async (ctx) => {
      const auth = getAuth(ctx);
      if (!auth?.userId) return ctx.json({ error: "Unauthorized" }, 401);
      const values = ctx.req.valid("json");
      const data = await db
        .insert(transactions)
        .values(values.map(transaction => ({
          id: createId(),
          ...transaction
        })))
        .returning();
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
      const transactionsToDelete = db
        .$with("transactions_to_delete")
        .as(
          db
            .select({
              id: transactions.id
            })
            .from(transactions)
            .innerJoin(accounts, eq(transactions.accountId, accounts.id))
            .where(
              and(
                inArray(transactions.id, ids),
                eq(accounts.userId, auth.userId)
              )
            )
        );

      const data = await db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
          inArray(transactions.id, sql`(select id from ${transactionsToDelete})`)
        )
        .returning({ id: transactions.id });

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
        id: transactions.id,
        amount: transactions.amount,
        date: transactions.date,
        notes: transactions.notes,
        payee: transactions.payee,
        accountId: transactions.accountId,
        categoryId: transactions.categoryId,
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          eq(transactions.id, id),
          eq(accounts.userId, auth.userId),
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
    zValidator("json", insertTransactionsSchema.omit({ id: true })),
    async (ctx) => {
      const auth = getAuth(ctx);
      if (!auth?.userId) return ctx.json({ error: "Unauthorized" }, 401);
      const { id } = ctx.req.valid("param");
      if (!id) return ctx.json({ error: "Id missing" }, 400);
      const values = ctx.req.valid("json");
      const transactionsToUpdate = db
        .$with("transactions_to_update")
        .as(
          db
            .select({
              id: transactions.id
            })
            .from(transactions)
            .innerJoin(accounts, eq(transactions.accountId, accounts.id))
            .where(
              and(
                eq(transactions.id, id),
                eq(accounts.userId, auth.userId)
              )
            )
        );

      const [data] = await db
        .with(transactionsToUpdate)
        .update(transactions)
        .set(values)
        .where(
          inArray(transactions.id, sql`(select id from ${transactionsToUpdate})`)
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
      const transactionsToDelete = db
        .$with("transactions_to_delete")
        .as(
          db
            .select({
              id: transactions.id
            })
            .from(transactions)
            .innerJoin(accounts, eq(transactions.accountId, accounts.id))
            .where(
              and(
                eq(transactions.id, id),
                eq(accounts.userId, auth.userId)
              )
            )
        );

      const [data] = await db
        .with(transactionsToDelete) 
        .delete(transactions)
        .where(
          inArray(transactions.id, sql`(select id from ${transactionsToDelete})`)
        ).returning({
          id: categories.id
        });

      if (!data) return ctx.json({ error: "Not found" }, 404);
      return ctx.json({
        data
      })
    }
  );

export default transactionsApi;