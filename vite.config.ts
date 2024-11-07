import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	esbuild: {
        target: "es2022"
    },
	plugins: [sveltekit()]
});
