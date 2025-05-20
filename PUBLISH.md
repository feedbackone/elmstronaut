# Publishing checklist

- [ ] Run `pnpm build`
- [ ] Verify that all examples work
- [ ] Run `pnpm changeset`
  - [ ] Choose between patch/minor/major
  - [ ] Describe the changes (don't add hyphens before items, they will be added automatically)
- [ ] Run `pnpm changeset version` - this will bump the version in `package.json` and add the changes to `CHANGELOG.md`
- [ ] Finally, run `pnpm changeset publish` to publish the package on npm
- [ ] `git commit -m "x.y.z"`
- [ ] `git push` and `git push --tags` (the tag will be created by @changeset/cli on publish)
