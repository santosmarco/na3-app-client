import { useEffect, useState } from "react";

type Cursor =
  | "alias"
  | "all-scroll"
  | "auto"
  | "cell"
  | "col-resize"
  | "context-menu"
  | "copy"
  | "crosshair"
  | "default"
  | "e-resize"
  | "ew-resize"
  | "grab"
  | "grabbing"
  | "help"
  | "move"
  | "n-resize"
  | "ne-resize"
  | "nesw-resize"
  | "no-drop"
  | "none"
  | "not-allowed"
  | "ns-resize"
  | "nw-resize"
  | "nwse-resize"
  | "pointer"
  | "progress"
  | "row-resize"
  | "s-resize"
  | "se-resize"
  | "sw-resize"
  | "text"
  | "vertical-text"
  | "w-resize"
  | "wait"
  | "zoom-in"
  | "zoom-out";

type SetCursor = (cursor: Cursor) => void;

type UseCursorReturn = [Cursor, SetCursor];

export function useCursor(defaultValue: Cursor = "auto"): UseCursorReturn {
  const [cursor, setCursor] = useState(defaultValue);

  useEffect(() => {
    if (document.body.style.cursor !== cursor) {
      document.body.style.cursor = cursor;
    }
  }, [cursor]);

  return [cursor, setCursor];
}
