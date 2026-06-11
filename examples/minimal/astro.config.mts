import { defineConfig } from "astro/config"
import tailwindcss from "@tailwindcss/vite"
// import elmstronaut from "elmstronaut"

/* For development use */
import elmstronaut from "../../src/index"

// https://astro.build/config
export default defineConfig({
  integrations: [elmstronaut()],
  vite: {
    plugins: [tailwindcss()],

    server: {
      fs: {
        // Allow serving files from to the `elmstronaut` project root
        allow: ["../.."],
      },
    },
  },
})
