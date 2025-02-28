/**
 * Set this to `true` when developing the package.
 *
 * This significantly improves the developer experience
 * by using source files directly when possible, and
 * adds a watcher for all other files.
 *
 * NOTE: The reason this isn't placed in the `const.ts` file
 * is that it needs to reside in a file that can be imported
 * by both server and client code.
 */
export const CREATOR_MODE = false;
