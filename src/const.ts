import path from "node:path";

/** The absolute path to the package root directory. */
export const PACKAGE_ROOT_DIR = path.join(import.meta.dirname, "..");

/**
 * The absolute path to the `bootstrap.js` file.
 *
 * This file initializes the `__elmInitQueue`, calls `window.onElmInit`
 * with the correct arguments, and ensures that it is defined only once.
 */
export const BOOTSTRAP_SCRIPT_PATH = path.join(
	import.meta.dirname,
	"static",
	"bootstrap.js",
);

/**
 * The absolute path to the `elmstronaut.d.ts` file.
 *
 * This file provides all the necessary types for Elm
 * components, including declarations of *.elm modules,
 * types for `window.onElmInit`, and more.
 */
export const ELMSTRONAUT_D_TS_PATH = path.join(
	import.meta.dirname,
	"static",
	"elmstronaut.d.ts",
);
