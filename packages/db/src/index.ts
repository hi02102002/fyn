import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(process.env.DATABASE_URL || "");

export * from "./schema/auth";
export * from "./schema/bot";

// Re-export commonly used drizzle-orm utilities
export { eq } from "drizzle-orm";
