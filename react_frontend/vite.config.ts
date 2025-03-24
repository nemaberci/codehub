import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

import hosts from "./hosts.js";
import monacoEditorPlugin from "vite-plugin-monaco-editor";
console.log(hosts.USER_HOST, hosts.CHALLENGE_HOST, hosts.SOLUTION_HOST);

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tsconfigPaths(),
		// For some reason, this is not imported propertly, so we need to manually extract the default export
		// @ts-ignore
		monacoEditorPlugin.default({})
	],
	assetsInclude: ["**/*.md", "**/*.java"],
	server: {
		port: 5000,
		proxy: {
			"/api/solution": {
				target: hosts.SOLUTION_HOST,
				//changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
			"/api/user": {
				target: hosts.USER_HOST,
				//changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
			"/api/challenge": {
				target: hosts.CHALLENGE_HOST,
				//changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
			"/auth/google": {
				target: hosts.USER_HOST,
				rewrite: (path) => path,
			},
			"/auth/google/callback": {
				target: hosts.USER_HOST,
				rewrite: (path) => path,
			},
		},
	},
});
