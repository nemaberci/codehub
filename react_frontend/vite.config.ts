import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

import hosts from "./hosts.js";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	assetsInclude: ["**/*.md", "**/*.java"],
	server: {
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
		},
	},
});
