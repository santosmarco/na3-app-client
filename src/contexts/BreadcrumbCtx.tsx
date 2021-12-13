import type { MaybeArray } from "@types";
import React, { createContext, useCallback, useMemo } from "react";
import type { Falsy } from "utility-types";

export type BreadcrumbContext = {
  extra: string[];
  setExtra: (extra: Falsy | MaybeArray<string>) => void;
};

export const BreadcrumbCtx = createContext<BreadcrumbContext>({
  extra: [],
  setExtra: () => null,
});

export function BreadcrumbProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [extra, setExtra] = React.useState<string[]>([]);

  const handleSetExtra = useCallback(
    (updatedExtra: Falsy | MaybeArray<string>) => {
      if (!updatedExtra) { setExtra([]); return; }
      const extraArray =
        typeof updatedExtra === "string" ? [updatedExtra] : [...updatedExtra];
      setExtra(extraArray);
    },
    []
  );

  const ctxValue = useMemo(
    () => ({ extra, setExtra: handleSetExtra }),
    [extra, handleSetExtra]
  );

  return (
    <BreadcrumbCtx.Provider value={ctxValue}>{children}</BreadcrumbCtx.Provider>
  );
}
