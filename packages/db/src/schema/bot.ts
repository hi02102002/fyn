import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const bot = pgTable("bot", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const botBlock = pgTable("bot_block", {
	id: text("id").primaryKey(),
	botId: text("bot_id")
		.notNull()
		.references(() => bot.id, { onDelete: "cascade" }),
	type: text("type").notNull(), // 'text', 'input', 'choice', 'conditional'
	config: jsonb("config").notNull(), // Block-specific configuration
	position: jsonb("position"), // { x: number, y: number }
	connections: jsonb("connections"), // Array of connected block IDs
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const botResponse = pgTable("bot_response", {
	id: text("id").primaryKey(),
	botId: text("bot_id")
		.notNull()
		.references(() => bot.id, { onDelete: "cascade" }),
	sessionId: text("session_id").notNull(),
	responses: jsonb("responses").notNull(), // User responses collected during execution
	completedAt: timestamp("completed_at"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
