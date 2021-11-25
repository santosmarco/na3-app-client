import React, { createContext, useCallback, useMemo } from "react";

export type BreadcrumbContext = {
  extra: string[];
  setExtra: (extra: string[] | string | undefined) => void;
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
    (updatedExtra: string[] | string | undefined) => {
      if (!updatedExtra) return setExtra([]);
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
