import React, { createContext, useContext } from "react";
import type { ComponentMap, Fetcher } from "../types";

interface ShellsContextValue {
  components: ComponentMap;
  fetcher: Fetcher;
}

const defaultFetcher: Fetcher = (url, options) =>
  fetch(url, options).then((res) => {
    if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    return res.json() as Promise<unknown>;
  });

const ShellsContext = createContext<ShellsContextValue | null>(null);

interface ShellsProviderProps {
  components: ComponentMap;
  /** Override the default fetch. Use this to inject auth headers, a base URL, etc. */
  fetcher?: Fetcher;
  children: React.ReactNode;
}

export function ShellsProvider({
  components,
  fetcher = defaultFetcher,
  children,
}: ShellsProviderProps): React.ReactElement {
  return (
    <ShellsContext.Provider value={{ components, fetcher }}>
      {children}
    </ShellsContext.Provider>
  );
}

export function useShells(): ShellsContextValue {
  const ctx = useContext(ShellsContext);
  if (!ctx) throw new Error("useShells must be called inside <ShellsProvider>");
  return ctx;
}
