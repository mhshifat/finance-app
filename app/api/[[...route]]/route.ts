import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import accountsApi from './accounts';
import categoriesApi from './categories';
import transactionsApi from './transactions';
import summaryApi from './summary';

export const runtime = 'edge';

const app = new Hono().basePath('/api');

const routes = app
  .route("/accounts", accountsApi)
  .route("/categories", categoriesApi)
  .route("/transactions", transactionsApi)
  .route("/summary", summaryApi);

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes;