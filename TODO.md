# TODO

- [ x ] Upgrade `@arethetypeswrong/cli`
- [ x ] Upgrade `@changesets/cli`
- [ x ] Upgrade `@types/node`
- [ x ] Upgrade `rimraf`
- [ x ] Upgrade `vitest`
- [ x ] Remove `@biomejs/biome`. Use `oxfmt` instead
- [ x ] Upgrade `typescript`
- [ x ] Upgrade `vite`
- [ x ] Upgrade `astro`
- [ ] Verify that `@source` is still needed for Tailwind
- [ ] Add support for rendering named slots

---

- Vite is upgraded to 7.3.3 since astro 6 supports vite 7

- Example upgrades
  -
  - "astro": "^6.3.7"
  - "@tailwindcss/vite": "^4.3.0"
  - "tailwindcss": "^4.3.0"
  ## Commands
        fnm install 22
        fnm use 22
        rm -rf node_modules
        pnpm i

---

- [ ] Add an optimize option to the config to force production builds when needed
- [ ] Generate a type union of all Elm module names. We can then use that type instead of string for elmModuleName.
