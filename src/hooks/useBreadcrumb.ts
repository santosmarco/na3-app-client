import type { BreadcrumbContext } from "@contexts";
import { BreadcrumbCtx } from "@contexts";
import { useContext, useEffect } from "react";

type UseBreadcrumbReturn = BreadcrumbContext;

export function useBreadcrumb(): UseBreadcrumbReturn {
  const { extra, setExtra } = useContext(BreadcrumbCtx);

  useEffect((): (() => void) => {
    return (): void => {
      setExtra([]);
    };
  }, [setExtra]);

  return { extra, setExtra };
}
