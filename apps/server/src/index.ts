import "dotenv/config";
import type { Server as HTTPServer } from "node:http";
import { handler } from "@fyn/auth";
import { initSocketInstance } from "@fyn/socket";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { orpcMiddleware } from "./middlewares/orpc";
import { socketMiddleware } from "./middlewares/socket";
import type { AppVariables } from "./types/vars";

const app = new Hono<AppVariables>();

app.use(logger());
app.use(
	"/*",
	cors({
		origin: process.env.CORS_ORIGIN || "",
		allowMethods: ["GET", "POST", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => handler(c.req.raw));

app.use("/*", orpcMiddleware);

app.get("/", (c) => {
	return c.text("OK");
});

const httpServer = serve(
	{
		fetch: app.fetch,
		port: 3000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);

const io = initSocketInstance(httpServer as HTTPServer);

app.use("/*", socketMiddleware(io));
