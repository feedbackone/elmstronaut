# Contributing

Thanks for your interest in helping improve Elmstronaut!

## Local development environment

To get started, follow the [installation](/README.md#installation) and [setup](README.md#setup) steps in [README.md](/README.md) to set up Elmstronaut. Once you're done with that, follow these steps to set up your local development environment:

1.  Clone this repo

    ```sh
    git clone git@github.com:feedbackone/elmstronaut.git
    ```

2.  Install dependencies

    ```sh
    cd elmstronaut
    pnpm install
    ```

3.  In the _package.json_ of your Astro project (not the cloned repo), modify the `elmstronaut` dependency to point to the local version.

    ```diff
    "dependencies": {
    -  "elmstronaut": "^0.1.0",
    +  "elmstronaut": "link:../../",
    }
    ```

    The `link:` should point to the cloned `elmstronaut` repo.

4. Run `rm -rf node_modules` to nuke the existing dependencies.
5. Run `pnpm install` in your Astro project (not the cloned repo). This will link the package to the local version.


### Running development version

1.  In the _astro.config.mts_ of your Astro project, modify the import of `elmstronaut` to point to the `index.ts` file (located in the `src` directory of the cloned repo).

    ```diff
    -  import elmstronaut from "elmstronaut";
    +  import elmstronaut from "../../src/index";
    ```

2.  In the `dev.ts` (located in the `src` directory of the cloned repo), set `CREATOR_MODE` to `true`.

3.  Navigate back to your Astro project and run `pnpm dev`.

### Running production version

1. Add the following snippet to the _astro.config.mts_

```diff
export default defineConfig({
  integrations: [elmstronaut()],
+  vite: {
+    server: {
+      fs: {
+        // Allow serving files from to the `elmstronaut` project root
+        allow: ["../.."],
+      },
+    },
+  },
});
```

2.  Navigate back to your Astro project and run `pnpm dev`.

---
And you're done! 🎉  
Thanks again for checking out this page! You're awesome!
