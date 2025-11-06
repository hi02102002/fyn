import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		tsconfigPaths(),
		tailwindcss(),
		tanstackStart({
			router: {
				routeFileIgnorePattern:
					"^_(components|utils|hooks|styles|types|store)$",
			},
		}),
		nitro({
			config: {
				preset: "node-server",
			},
		}),
		viteReact(),
	],
	build: {
		rollupOptions: {
			plugins: [visualizer()],
		},
	},
});
