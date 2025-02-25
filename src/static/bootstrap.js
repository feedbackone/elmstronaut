/** Elmstronaut Bootstrap Script */
(() => {
  // Elm apps that have been initialized are kept in this queue
  // until `window.onElmInit` is defined.
  window.__elmInitQueue = [];

  // If `window.onElmInit` is defined, use it.
  // Otherwise, set it to `undefined` (treated as a special value).
  let fn =
    typeof window.onElmInit === "function" ? window.onElmInit : undefined;

  Object.defineProperty(window, "onElmInit", {
    get: () => fn,
    set: (value) => {
      // The value should be a function.
      if (typeof value !== "function") {
        return;
      }

      // This is the first time `window.onElmInit` is defined.
      if (fn === undefined) {
        fn = value;

        // Call `window.onElmInit` on all queued components.
        for (const { elmModuleName, app } of window.__elmInitQueue) {
          fn(elmModuleName, app);
        }
      } else {
        // This is a design choice to prevent users from creating issues
        // caused by multiple `window.onElmInit` definitions.
        // Let's hope we don't regret it.
        throw new Error("`window.onElmInit` should only be defined once.");
      }
    },
  });
})();
