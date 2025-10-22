import { bot, botBlock, botResponse, db } from "@fyn/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../index";

// Schema definitions for validation
const blockConfigSchema = z.object({
	text: z.string().optional(),
	placeholder: z.string().optional(),
	options: z.array(z.string()).optional(),
	variable: z.string().optional(),
	condition: z
		.object({
			variable: z.string(),
			operator: z.enum(["equals", "contains", "greaterThan", "lessThan"]),
			value: z.string(),
		})
		.optional(),
});

const blockSchema = z.object({
	id: z.string(),
	type: z.enum(["text", "input", "choice", "conditional"]),
	config: blockConfigSchema,
	position: z
		.object({
			x: z.number(),
			y: z.number(),
		})
		.optional(),
	connections: z.array(z.string()).optional(),
});

const createBotSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
});

const updateBotSchema = z.object({
	name: z.string().min(1).optional(),
	description: z.string().optional(),
	blocks: z.array(blockSchema).optional(),
});

const executeBotSchema = z.object({
	sessionId: z.string(),
	currentBlockId: z.string(),
	response: z.any().optional(),
});

export const botRouter = {
	// Create a new bot
	createBot: protectedProcedure
		.input(createBotSchema)
		.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const botId = `bot_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

			const [newBot] = await db
				.insert(bot)
				.values({
					id: botId,
					name: input.name,
					description: input.description,
					userId,
					createdAt: new Date(),
					updatedAt: new Date(),
				})
				.returning();

			return newBot;
		}),

	// Get a specific bot with its blocks
	getBot: protectedProcedure
		.input(z.object({ botId: z.string() }))
		.handler(async ({ input, context }) => {
			const userId = context.session.user.id;

			const [botData] = await db
				.select()
				.from(bot)
				.where(eq(bot.id, input.botId));

			if (!botData || botData.userId !== userId) {
				throw new Error("Bot not found or access denied");
			}

			const blocks = await db
				.select()
				.from(botBlock)
				.where(eq(botBlock.botId, input.botId));

			return {
				...botData,
				blocks,
			};
		}),

	// List all bots for the current user
	listBots: protectedProcedure.handler(async ({ context }) => {
		const userId = context.session.user.id;
		const bots = await db.select().from(bot).where(eq(bot.userId, userId));
		return bots;
	}),

	// Update bot (including blocks)
	updateBot: protectedProcedure
		.input(z.object({ botId: z.string() }).merge(updateBotSchema))
		.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const { botId, blocks, ...updateData } = input;

			// Verify ownership
			const [botData] = await db
				.select()
				.from(bot)
				.where(eq(bot.id, botId));

			if (!botData || botData.userId !== userId) {
				throw new Error("Bot not found or access denied");
			}

			// Update bot metadata if provided
			if (Object.keys(updateData).length > 0) {
				await db
					.update(bot)
					.set({
						...updateData,
						updatedAt: new Date(),
					})
					.where(eq(bot.id, botId));
			}

			// Update blocks if provided
			if (blocks) {
				// Delete existing blocks
				await db.delete(botBlock).where(eq(botBlock.botId, botId));

				// Insert new blocks
				if (blocks.length > 0) {
					await db.insert(botBlock).values(
						blocks.map((block) => ({
							id: block.id,
							botId,
							type: block.type,
							config: block.config,
							position: block.position,
							connections: block.connections || [],
							createdAt: new Date(),
							updatedAt: new Date(),
						})),
					);
				}
			}

			// Return updated bot
			const [updatedBot] = await db
				.select()
				.from(bot)
				.where(eq(bot.id, botId));

			const updatedBlocks = await db
				.select()
				.from(botBlock)
				.where(eq(botBlock.botId, botId));

			return {
				...updatedBot,
				blocks: updatedBlocks,
			};
		}),

	// Delete a bot
	deleteBot: protectedProcedure
		.input(z.object({ botId: z.string() }))
		.handler(async ({ input, context }) => {
			const userId = context.session.user.id;

			const [botData] = await db
				.select()
				.from(bot)
				.where(eq(bot.id, input.botId));

			if (!botData || botData.userId !== userId) {
				throw new Error("Bot not found or access denied");
			}

			await db.delete(bot).where(eq(bot.id, input.botId));

			return { success: true };
		}),

	// Execute bot (public endpoint for sharing)
	executeBot: publicProcedure
		.input(z.object({ botId: z.string() }).merge(executeBotSchema))
		.handler(async ({ input }) => {
			const { botId, sessionId, currentBlockId, response: userResponse } = input;

			// Get bot and blocks
			const [botData] = await db
				.select()
				.from(bot)
				.where(eq(bot.id, botId));

			if (!botData) {
				throw new Error("Bot not found");
			}

			const blocks = await db
				.select()
				.from(botBlock)
				.where(eq(botBlock.botId, botId));

			const currentBlock = blocks.find((b) => b.id === currentBlockId);

			if (!currentBlock) {
				throw new Error("Block not found");
			}

			// Store the response if provided
			if (userResponse !== undefined) {
				// Check if session exists
				const [existingResponse] = await db
					.select()
					.from(botResponse)
					.where(eq(botResponse.sessionId, sessionId));

				if (existingResponse) {
					// Update existing response
					const responses = existingResponse.responses as Record<string, unknown>;
					responses[currentBlockId] = userResponse;

					await db
						.update(botResponse)
						.set({
							responses,
							updatedAt: new Date(),
						})
						.where(eq(botResponse.sessionId, sessionId));
				} else {
					// Create new response
					await db.insert(botResponse).values({
						id: `resp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
						botId,
						sessionId,
						responses: { [currentBlockId]: userResponse },
						createdAt: new Date(),
						updatedAt: new Date(),
					});
				}
			}

			// Determine next block based on current block type
			let nextBlockId: string | null = null;
			const config = currentBlock.config as Record<string, unknown>;

			if (currentBlock.type === "conditional" && config.condition) {
				// Get stored responses for this session
				const [sessionResponses] = await db
					.select()
					.from(botResponse)
					.where(eq(botResponse.sessionId, sessionId));

				if (sessionResponses) {
					const condition = config.condition as {
						variable: string;
						operator: string;
						value: string;
					};
					const responses = sessionResponses.responses as Record<string, unknown>;
					const variableValue = String(responses[condition.variable] || "");

					let conditionMet = false;
					switch (condition.operator) {
						case "equals":
							conditionMet = variableValue === condition.value;
							break;
						case "contains":
							conditionMet = variableValue.includes(condition.value);
							break;
						case "greaterThan":
							conditionMet = Number(variableValue) > Number(condition.value);
							break;
						case "lessThan":
							conditionMet = Number(variableValue) < Number(condition.value);
							break;
					}

					// Get connections array
					const connections = currentBlock.connections as string[];
					// For conditional blocks, first connection is "true" path, second is "false" path
					nextBlockId = conditionMet ? connections?.[0] : connections?.[1];
				}
			} else {
				// For non-conditional blocks, take the first connection
				const connections = currentBlock.connections as string[];
				nextBlockId = connections?.[0] || null;
			}

			const nextBlock = nextBlockId ? blocks.find((b) => b.id === nextBlockId) : null;

			return {
				currentBlock: {
					id: currentBlock.id,
					type: currentBlock.type,
					config: currentBlock.config,
				},
				nextBlock: nextBlock
					? {
							id: nextBlock.id,
							type: nextBlock.type,
							config: nextBlock.config,
						}
					: null,
				completed: !nextBlock,
			};
		}),
};
