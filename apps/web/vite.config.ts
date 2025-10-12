import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
	plugins: [tsconfigPaths(), tailwindcss(), tanstackStart(), viteReact()],
	build: {
		rollupOptions: {
			plugins: [visualizer()],
		},
	}
});
