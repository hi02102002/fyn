import { api } from "@fyn/auth";
import type { TIo } from "@fyn/socket";
import type { Context as HonoContext } from "hono";

export type CreateContextOptions = {
		context: HonoContext<{
			Variables: {
				io?: TIo;
			};
		}>;
	};

export async function createContext({ context }: CreateContextOptions) {
	const session = await api.getSession({
		headers: context.req.raw.headers,
	});

	return {
		session,
		io: context.get("io") as TIo,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
