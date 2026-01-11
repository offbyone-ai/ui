import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

export default defineConfig({
	integrations: [
		tailwind(),
		mdx({
			syntaxHighlight: "shiki",
			shikiConfig: {
				theme: "github-dark",
				wrap: true,
			},
		}),
		react(),
	],
	output: "static",
	site: "https://ui.offbyone.ai",
});
