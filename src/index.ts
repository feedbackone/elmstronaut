import { readFileSync } from "node:fs";
import path from "node:path";
import type { AstroIntegration, AstroRenderer } from "astro";
import type { ServerOptions, ViteDevServer } from "vite";
import {
	BOOTSTRAP_SCRIPT_PATH,
	ELMSTRONAUT_D_TS_PATH,
	PACKAGE_ROOT_DIR,
} from "./const.js";
import { CREATOR_MODE } from "./dev.js";
import { Elmstronaut } from "./global.js";
import vitePlugin from "./vitePlugin.js";

/**
 * An Astro integration that enables rendering of Elm modules as Astro components.
 *
 * @example
 * ```ts
 * // astro.config.mts
 * import { defineConfig } from "astro/config";
 * import elmstronaut from "elmstronaut";
 *
 * export default defineConfig({
 *   integrations: [elmstronaut()]
 * });
 * ```
 */
export default function elmstronaut(): AstroIntegration {
	return {
		name: "elmstronaut",
		hooks: {
			"astro:config:setup": async ({
				addRenderer,
				command,
				injectScript,
				updateConfig,
			}) => {
				// Inject the bootstrap script.
				// We need this to properly handle `window.onElmInit` callback definition.
				injectScript(
					"head-inline",
					readFileSync(BOOTSTRAP_SCRIPT_PATH, "utf-8"),
				);

				// Add Elm renderer.
				addRenderer(getRenderer());

				// Add custom vite plugin for Elm files.
				updateConfig({
					vite: {
						// This fixes the issue where Astro tries to parse
						// Elm files as JS files.
						assetsInclude: ["src/elm/**/*.elm"],
						// Used for dependency pre-bundling.
						// See https://vite.dev/guide/dep-pre-bundling for more info.
						optimizeDeps: {
							include: [
								// Add client-side renderer to dependency pre-bundling.
								"elmstronaut/client.js",
							],
							exclude: [
								// Make sure to exclude any server files from dependency pre-bundling.
								"elmstronaut/server.js",
							],
						},
						server: getViteServerConfig(),
						plugins: [vitePlugin(command === "dev")],
					},
				});
			},
			"astro:config:done": ({ injectTypes }) => {
				// This fixes the issue where Astro doesn't recognize Elm files.
				injectTypes({
					filename: "elmstronaut.d.ts",
					content: readFileSync(ELMSTRONAUT_D_TS_PATH, "utf-8"),
				});
			},
			"astro:server:setup": ({ server }) => {
				// Restart the server when the bootstrap script changes.
				watchBootstrapScript(server);
			},
			"astro:build:done": () => {
				Elmstronaut.cache.clear();
			},
		},
	};
}

function getRenderer(): AstroRenderer {
	if (CREATOR_MODE) {
		return {
			name: "elm",
			clientEntrypoint: path.join(import.meta.dirname, "client.ts"),
			serverEntrypoint: path.join(import.meta.dirname, "server.ts"),
		};
	}

	return {
		name: "elm",
		clientEntrypoint: "elmstronaut/client.js",
		serverEntrypoint: "elmstronaut/server.js",
	};
}

function getViteServerConfig(): ServerOptions | undefined {
	if (!CREATOR_MODE) {
		return undefined;
	}

	return {
		fs: {
			// Allow imports of any files from the `elmstronaut` directory.
			allow: [PACKAGE_ROOT_DIR],
		},
	};
}

function watchBootstrapScript(server: ViteDevServer): void {
	if (!CREATOR_MODE) {
		return;
	}

	server.watcher.add(BOOTSTRAP_SCRIPT_PATH);
	server.watcher.on("change", (changedFilePath) => {
		if (changedFilePath === BOOTSTRAP_SCRIPT_PATH) {
			server.restart();
		}
	});
}
