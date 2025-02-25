import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import elmstronaut from "../../src/index";
// import elmstronaut from "elmstronaut";

// https://astro.build/config
export default defineConfig({
	integrations: [elmstronaut()],
	vite: {
		plugins: [tailwindcss()],
	},
});
