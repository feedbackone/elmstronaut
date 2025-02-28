import { createWriteStream, existsSync } from "node:fs";
import { readFile, rm } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import spawn from "cross-spawn";
import type { PluginOption } from "vite";
import { CREATOR_MODE } from "./dev.js";
import { missingElmExecutable, missingElmJson } from "./errors.js";
import { Elmstronaut } from "./global.js";
import { hashFromPath } from "./utils.js";

/**
 * A custom Vite plugin that transforms Elm files into ESM modules.
 *
 * @param isAstroDevMode - true if Astro is running in development mode
 */
export default function vitePlugin(isAstroDevMode: boolean): PluginOption {
  return {
    name: "vite-plugin-elmstronaut",
    async transform(code, id, options) {
      // Only transform Elm files.
      const isElmFile = id.endsWith(".elm");
      if (!isElmFile) {
        return;
      }

      // Skip virtual modules.
      const ASTRO_ENTRY_PREFIX = "\0astro-entry:";
      const isAstroEntry = id.includes(ASTRO_ENTRY_PREFIX);
      if (isAstroEntry) {
        return;
      }

      // This hash is later used in the `check` function of the server renderer.
      const hash = await hashFromPath(id);
      Elmstronaut.cache.add(hash);

      // Skip compilation when rendering on the server.
      if (options?.ssr) {
        return;
      }

      try {
        const js = await compileElm(id, isAstroDevMode);
        return js;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "";
        this.error(`Error compiling ${id}.\n\n${errorMessage}\n`);
      }
    },
  };
}

async function compileElm(
  filePath: string,
  isAstroDevMode: boolean,
): Promise<string> {
  // Example
  // [filePath]: "/Users/Henrikh/Desktop/elmstronaut/examples/minimal/src/elm/src/Greeting/Hello.elm"

  const cwd = process.cwd();
  // [cwd]: "/Users/Henrikh/Desktop/elmstronaut/examples/minimal"

  const elmJsonPath = path.join(cwd, "elm.json");
  // [elmJsonPath]: "/Users/Henrikh/Desktop/elmstronaut/examples/minimal/elm.json"

  // Show a helpful error message if `elm.json` is missing
  if (!existsSync(elmJsonPath)) {
    throw new Error(missingElmJson(elmJsonPath));
  }

  const elmExecutable = path.join(cwd, "node_modules", "elm", "bin", "elm");
  // [elmExecutable]: "/Users/Henrikh/Desktop/elmstronaut/examples/minimal/node_modules/elm/bin/elm"

  // Show a helpful error message if `elm` executable is missing
  if (!existsSync(elmExecutable)) {
    throw new Error(missingElmExecutable(elmExecutable));
  }

  const elmDir = path.join(cwd, "src", "elm");
  // [elmDir]: "/Users/Henrikh/Desktop/elmstronaut/examples/minimal/src/elm"

  const elmFileRelativePath = filePath.replace(`${elmDir}/`, "");
  // [elmFileRelativePath]: "Greeting/Hello.elm"

  const elmModuleName = elmFileRelativePath
    .replace("/", ".")
    .replace(".elm", "");
  // [elmModulePath]: "Greeting.Hello"

  const outputFilePath = path.join(elmDir, `${elmModuleName}-${Date.now()}.js`);
  // [outputFilePath]: "/Users/Henrikh/Desktop/elmstronaut/examples/minimal/src/elm/Greeting.Hello-1739905905593.js"

  if (CREATOR_MODE) {
    console.debug("[compileElm]", {
      filePath,
      cwd,
      elmExecutable,
      elmDir,
      elmFileRelativePath,
      elmModuleName,
      outputFilePath,
    });
  }

  await new Promise<void>((resolve, reject) => {
    const elmMake = spawn(
      elmExecutable,
      [
        "make",
        elmFileRelativePath,
        "--output",
        outputFilePath,
        isAstroDevMode ? "" : "--optimize",
      ].filter((s) => s),
      {
        // Execute `elm make` from the same folder where `elm.json` is located.
        cwd: elmDir,
      },
    );

    // If we set `stdio` to "inherit" in the `spawn` options, the error streams
    // from different processes can collide, producing incomprehendable error messages.
    // Instead, we'll create a temporary file for each component and pipe the `stderr`
    // from the `elm make` there. We'll then print the contents on the `close` event.
    const logFilePath = path.join(elmDir, `${elmModuleName}-${Date.now()}.log`);
    elmMake.stderr?.pipe(createWriteStream(logFilePath));

    elmMake.on("error", async (err) => {
      reject(new Error(`Failed to start Elm compiler: ${err.message}`));
    });

    elmMake.on("close", async (code) => {
      if (code !== 0) {
        const log = await readFile(logFilePath, "utf-8");
        const errorMessage = `Elm compiler exited with code ${code}:\n\n${prettify(log)}`;

        reject(new Error(errorMessage));
      } else {
        resolve();
      }

      // Remove the temporary log file.
      await rm(logFilePath);
    });
  });

  const js = await readFile(outputFilePath, "utf-8");

  // Modify the compiled Elm code to export as a proper ES module.
  const modifiedJs = `\
let Component;
(function() {
  ${js.replace("(this)", "(globalThis)")}
  globalThis.Elm.${elmModuleName}.__name = '${elmModuleName}';
  Component = globalThis.Elm.${elmModuleName};
})();
export default Component;\
`;

  // Remove the temporary output file.
  await rm(outputFilePath);

  return modifiedJs;
}

function prettify(log: string): string {
  // 1. Removes leading and trailing white space
  // 2. Indents every line with ">   "
  return log.trim().replace(/^/gm, ">   ");
}
