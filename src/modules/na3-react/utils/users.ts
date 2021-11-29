import * as colors from "@ant-design/colors";

import type { Na3UserStyle, WebColor } from "../../na3-types";
import { pickRandom } from "./arrays";

export function createRandomUserStyle(): Na3UserStyle {
  const colorKeys: WebColor[] = [
    "blue",
    "cyan",
    "geekblue",
    "gold",
    "green",
    "lime",
    "magenta",
    "orange",
    "purple",
    "red",
    "volcano",
    "yellow",
  ];

  const chosen = pickRandom(colorKeys);

  return {
    backgroundColor: colors[chosen][2],
    color: colors[chosen][8],
    webColor: chosen,
  };
}
