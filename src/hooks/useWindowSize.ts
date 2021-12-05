import { useEffect, useState } from "react";

type WindowSize = {
  height: number;
  width: number;
};

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    height: 0,
    width: 0,
  });

  useEffect(() => {
    function handleResize(): void {
      setWindowSize({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return (): void => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
}
