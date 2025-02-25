import type { AstroComponentMetadata, SSRLoadedRendererValue } from "astro";
import { CREATOR_MODE } from "./dev.js";
import { Elmstronaut } from "./global.js";
import { decodeBase64, hashFromContent } from "./utils.js";

type StaticMarkup = {
  html: string;
  attrs?: Record<string, string>;
};

/**
 * Server-side renderer for Elm components in Astro.
 */
const serverSideRenderer: SSRLoadedRendererValue = {
  /**
   * This function is used by Astro to determine whether this integration
   * should be responsible for rendering the provided component.
   *
   * It should return `true` for the following scenarios:
   *   1. "/src/elm/Counter.elm"
   *   2. "/src/elm/Counter.elm?t=1739910080397"
   *   3. "data:application/octet-stream;base64,..."
   */
  check: async (
    Component: unknown,
    props: Record<string, unknown>,
    slots: Record<string, string>,
    metadata?: AstroComponentMetadata,
  ): Promise<boolean> => {
    if (CREATOR_MODE) {
      console.debug("[serverSideRenderer::check]", {
        Component,
        props,
        slots,
        metadata,
      });
    }

    if (typeof Component !== "string") {
      return false;
    }

    // Scenario 3
    // When running `astro build`, Astro will encode the Elm code as
    // base64 data URL with "application/octet-stream" MIME type.
    const APPLICATION_OCTET_STREAM_PREFIX =
      "data:application/octet-stream;base64,";
    if (Component.startsWith(APPLICATION_OCTET_STREAM_PREFIX)) {
      // We don't have access to the file path here, so we can't check the file extension
      // or if the file exists. But we were saving the hashes of all Elm files along the way,
      // so we just need to verify that we've seen that hash before.
      const base64code = Component.slice(
        APPLICATION_OCTET_STREAM_PREFIX.length,
      );
      const code = decodeBase64(base64code);
      const hash = hashFromContent(code);
      return Elmstronaut.cache.has(hash);
    }

    // Scenario 1 & 2
    return Component.split("?").at(0)?.endsWith(".elm") ?? false;
  },
  renderToStaticMarkup: async (
    Component: string,
    props: Record<string, unknown>,
    slots: Record<string, string>,
    metadata?: AstroComponentMetadata,
  ): Promise<StaticMarkup> => {
    if (CREATOR_MODE) {
      console.debug("[serverSideRenderer::renderToStaticMarkup]", {
        Component,
        props,
        slots,
        metadata,
      });
    }

    return {
      // NOTE: If the "fallback" slot is not provided, we render
      // a space – not an empty string. If an empty string is provided,
      // the nested component is fully rendered.
      html: slots.fallback ?? " ",
      attrs: {},
    };
  },
};
export default serverSideRenderer;
