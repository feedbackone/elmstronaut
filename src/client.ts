/// <reference path="./static/elmstronaut.d.ts" />

import { CREATOR_MODE } from "./dev.js";

interface ElmModule {
  __name: string;
  init: (options: {
    node: HTMLElement;
    // Although flags could be of any type, Record is used here
    // because we're passing props, which are always records.
    flags?: Record<string, unknown>;
  }) => ElmApp;
}

declare global {
  interface Window {
    /**
     * Elm apps that have been initialized are kept in this queue
     * until `window.onElmInit` is defined.
     */
    __elmInitQueue: Array<{ elmModuleName: string; app: ElmApp }>;
  }
}

/**
 * Client-side renderer for Elm components in Astro.
 */
export default function clientSideRenderer(element: HTMLElement) {
  return (
    Component: unknown,
    props: Record<string, unknown>,
    slots: Record<string, string>,
    metadata?: unknown,
  ) => {
    if (CREATOR_MODE) {
      console.debug("[clientSideRenderer]", {
        element,
        Component,
        props,
        slots,
        metadata,
      });
    }

    if (!Component) {
      return;
    }

    const isElmModule =
      typeof Component === "object" &&
      "__name" in Component &&
      typeof Component.__name === "string" &&
      "init" in Component &&
      typeof Component.init === "function";

    if (!isElmModule) {
      return;
    }

    // NOTE: TypeScript should ideally do the type narrowing for us here.
    const elmModule = Component as ElmModule;
    const elmModuleName = elmModule.__name;

    try {
      // Initialize Elm component.
      const app = elmModule.init({
        node: element,
        flags: props,
      });

      registerInitCallback(elmModuleName, app);
    } catch (exception) {
      renderError(element, elmModuleName, exception);
    }
  };
}

function registerInitCallback(elmModuleName: string, app: ElmApp) {
  // `window.onElmInit` is already defined
  if (typeof window.onElmInit === "function") {
    // All good. Call the callback!
    window.onElmInit(elmModuleName, app);
  }
  // `window.onElmInit` is not yet defined
  else {
    // Add the module name and the initialized app to the queue.
    // When the user defines the callback, it will automatically
    // be called on all items in the queue.
    window.__elmInitQueue.push({ elmModuleName, app });
  }
}

function renderError(
  element: HTMLElement,
  elmModuleName: string,
  exception: unknown,
) {
  const pre = document.createElement("pre");
  if (exception instanceof Error) {
    const { stack } = exception;
    pre.textContent = `Module "${elmModuleName}" cannot be initialized.\n\n${stack}`;
  } else {
    pre.textContent = `Module "${elmModuleName}" cannot be initialized.\n\n${exception}`;
  }
  Object.assign(pre.style, {
    borderLeft: "1px solid red",
    paddingLeft: "24px",
  });
  element.appendChild(pre);
}
