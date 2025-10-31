import { z } from "zod";

export const LoginSchema = z.object({
	email: z
		.email({
			error: "Invalid email address",
		})
		.min(1, {
			message: "Please enter your email address",
		}),
});

export type TLoginSchema = z.infer<typeof LoginSchema>;
