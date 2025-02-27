# Contributing

Thanks for your interest in helping improve Elmstronaut!

## Local development environment
First things first, follow the installation and setup guides in [README.md](/README.md) to set up Elmstronaut. Once you're done with that, follow these steps to set up your local development environment:

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

4.  Run `pnpm install` in your Astro project (not the cloned repo). This will link the package to the local version.

5.  In the _astro.config.mts_ of your Astro project, modify the import of `elmstronaut` to point to the `index.ts` file (located in the `src` directory of the cloned repo).
    ```diff
    -  import elmstronaut from "elmstronaut";
    +  import elmstronaut from "../../src/index";
    ```

6. In the `const.ts` (located in the `src` directory of the cloned repo), set `CREATOR_MODE` to `true`.

And you're done! 🎉  
Thanks again checking out this page! You're awesome!
