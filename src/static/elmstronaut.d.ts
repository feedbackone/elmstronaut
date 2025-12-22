declare module "*.elm" {
  // We couldn't find a proper type for an Astro component.
  // Please open a PR if you know of a better option.
  // biome-ignore lint/suspicious/noExplicitAny: ^
  const Component: any;
  export default Component;
}

declare namespace globalThis {
  interface Window {
    onElmInit?: (elmModuleName: string, app: ElmApp) => void;
  }
}

interface ElmApp {
  ports?: Record<string, ElmPort>;
}

type ElmPort = Incoming | Outgoing;

type ElmstronautOptions = {
  pathToElm?: string;
  pathToElmJson?: string;
  debug?: boolean;
  optimize?: boolean;
};

type Incoming = {
  send(...args): void;

  // Must be `undefined` for an incoming port.
  subscribe: undefined;
  unsubscribe: undefined;
};

type Outgoing = {
  subscribe(callback: (...args) => void): void;
  unsubscribe(callback: (...args) => void): void;

  // Must be `undefined` for an outgoing port.
  send: undefined;
};
