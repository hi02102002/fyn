import { api } from "@fyn/auth";
import type { Context as HonoContext } from "hono";

export type CreateContextOptions = {
	context: HonoContext;
};

export async function createContext({ context }: CreateContextOptions) {
	const session = await api.getSession({
		headers: context.req.raw.headers,
	});
	
	return {
		session,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
