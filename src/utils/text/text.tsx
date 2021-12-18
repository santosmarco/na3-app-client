import type { MaybeArray } from "@types";
import { nanoid } from "nanoid";
import React from "react";

export type ListStrOptions<T> = {
  connective?: "and" | "and/or" | "or";
  itemTransform?: (item: T, idx: number) => React.ReactNode;
};

export function listStr<T extends string>(
  items: MaybeArray<T>,
  options: ListStrOptions<T> = {
    connective: "and/or",
    itemTransform: (item): T => item,
  }
): React.ReactNode {
  function handleItemTransform(item: T, idx: number): React.ReactNode {
    return options.itemTransform?.(item, idx) ?? item;
  }

  const itemsArr = typeof items === "string" ? [items] : [...items];

  if (itemsArr.length === 0) {
    return;
  }

  const last = itemsArr.pop();

  if (!last) {
    return;
  }

  if (itemsArr.length === 0) {
    return handleItemTransform(last, 0);
  }

  let connectiveTranslated: string;
  switch (options.connective) {
    case "and":
      connectiveTranslated = "e";
      break;
    case "or":
      connectiveTranslated = "ou";
      break;

    default:
      connectiveTranslated = "e/ou";
  }

  return (
    <>
      {itemsArr.map(handleItemTransform).map((transformed, idx) => (
        <span key={nanoid()}>
          {transformed}
          {idx !== itemsArr.length - 1 && ", "}
        </span>
      ))}{" "}
      {connectiveTranslated} {handleItemTransform(last, itemsArr.length)}
    </>
  );
}
