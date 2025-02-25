type GlobalThis = typeof globalThis;

interface ExtendedGlobal extends GlobalThis {
  Elmstronaut: {
    cache: Set<string>;
  };
}

const extendedGlobal = globalThis as ExtendedGlobal;

extendedGlobal.Elmstronaut =
  // We only need to define it once
  extendedGlobal.Elmstronaut ??
  // Initial value
  Object.seal({
    cache: new Set<string>(),
  });

export const { Elmstronaut } = extendedGlobal;
