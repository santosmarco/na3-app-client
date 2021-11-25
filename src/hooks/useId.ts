import { nanoid } from "nanoid";
import { useState } from "react";

export function useId(prefix?: string): string {
  const [id] = useState(
    `${
      prefix ? `${prefix.trim().toLowerCase().split(" ").join("_")}_` : ""
    }${nanoid()}`
  );

  return id;
}
