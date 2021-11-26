import * as colors from "@ant-design/colors";

import { pickRandom } from "./arrays";

type ColorKey =
  | "blue"
  | "cyan"
  | "geekblue"
  | "gold"
  | "green"
  | "grey"
  | "lime"
  | "magenta"
  | "orange"
  | "purple"
  | "red"
  | "volcano"
  | "yellow";

export function pickRandomColorCombination(): [string, string] {
  const colorKeys: ColorKey[] = [
    "blue",
    "cyan",
    "geekblue",
    "gold",
    "green",
    "grey",
    "lime",
    "magenta",
    "orange",
    "purple",
    "red",
    "volcano",
    "yellow",
  ];
  const chosen = pickRandom(colorKeys);
  return [colors[chosen][2], colors[chosen][8]];
}
