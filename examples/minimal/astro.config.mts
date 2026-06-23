import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import elmstronaut from "elmstronaut"

// For development use
// import elmstronaut from "../../src/index"

// https://astro.build/config
export default defineConfig({
  integrations: [elmstronaut()],
  image: {
    domains: ["images.unsplash.com"],
  },
  vite: {
    plugins: [tailwindcss()],

    // For development use
    server: {
      fs: {
        // Allow serving files from the `elmstronaut` project root
        allow: ["../.."],
      },
    },
  },
})
