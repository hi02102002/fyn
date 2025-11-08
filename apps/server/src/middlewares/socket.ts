import type { TIo } from "@fyn/socket";
import { createMiddleware } from "hono/factory";
import type { AppVariables } from "@/types/vars";

export const socketMiddleware = (io: TIo) =>
	createMiddleware<AppVariables>(async (c, next) => {
		c.set("io", io);
		return next();
	});
