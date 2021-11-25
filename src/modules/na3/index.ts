import { Na3Controller } from "./classes";
import type { ControllerResult, Na3, Product as Na3Product } from "./types";

export type { ControllerResult, Na3, Na3Product };

export const na3 = Na3Controller.get();

export default na3;
