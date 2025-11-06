import { db } from "@fyn/db";
import * as schema from "@fyn/db/schema/auth";
import { sendMagicLinkEmail } from "@fyn/mail";
import { voidFn } from "@fyn/utils/void-fn";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { magicLink } from "better-auth/plugins";

const _auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
	}),
	trustedOrigins: [process.env.CORS_ORIGIN || ""],
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
		},
		github: {
			clientId: process.env.GITHUB_CLIENT_ID || "",
			clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
		},
	},
	emailAndPassword: {
		enabled: true,
	},
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
	},
	plugins: [
		magicLink({
			sendMagicLink({ email, url }) {
				console.log("Magic link URL:", url);
				sendMagicLinkEmail({
					to: email,
					url,
				}).catch(voidFn);
			},
		}),
	],
	account: {
		encryptOAuthTokens: true,
		accountLinking: {
			trustedProviders: ["google", "github", "email-password"],
			enabled: true,
			allowDifferentEmails: false,
		},
	},
});

const handler = _auth.handler;
const api = _auth.api;

export { handler, api };
