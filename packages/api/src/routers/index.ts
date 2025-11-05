import type { RouterClient } from "@orpc/server";
import { protectedProcedure, publicProcedure } from "../procedures";

export const appRouter = {
	healthCheck: publicProcedure.handler(() => {
		return "OK";
	}),
	privateData: protectedProcedure.handler(({ context }) => {
		return {
			message: "This is private",
			user: context.session?.user,
		};
	}),
	serverTime: publicProcedure.handler(() => {
		return {
			time: new Date().toISOString(),
		};
	}),
	hoho: publicProcedure.handler(() => {
		return "hoho haha momo";
	}),
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
