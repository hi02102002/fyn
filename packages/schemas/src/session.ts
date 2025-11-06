import z from "zod";

export const SessionSchema = z.object({
	session: z.object({
		id: z.string(),
		createdAt: z.date(),
		updatedAt: z.date(),
		userId: z.string(),
		expiresAt: z.date(),
		token: z.string(),
		ipAddress: z.string().nullable().optional(),
		userAgent: z.string().nullable().optional(),
	}),
	user: z.object({
		id: z.string(),
		createdAt: z.date(),
		updatedAt: z.date(),
		email: z.string(),
		emailVerified: z.boolean(),
		name: z.string(),
		image: z.string().nullable().optional(),
	}),
});

export type TSessionSchema = z.infer<typeof SessionSchema>;
