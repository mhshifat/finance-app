import { config } from "dotenv";
config({ path: ".env.local" });
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: "./db/schema.ts",
  dialect: "postgresql",
  out: "./drizzle",
  verbose: true,
  strict: true,
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
})