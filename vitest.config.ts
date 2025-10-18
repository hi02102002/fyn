import { sharedConfig } from "@fyn/vitest-config";
import { defineConfig } from "vitest/config";

export default defineConfig({
	...sharedConfig,
	test: {
		projects: [
			{
				root: "./packages",
				test: {
					...sharedConfig.test,
				},
			},
			{
				root: "./apps/web",
				test: {
					...sharedConfig.test,
					environment: "jsdom",
				},
			},
			{
				root: "./apps/server",
				test: {
					...sharedConfig.test,
					environment: "node",
				},
			},
		],
	},
});
