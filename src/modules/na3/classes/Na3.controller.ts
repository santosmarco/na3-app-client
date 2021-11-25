import type { Na3 } from "../types";
import { Na3BatchIdController } from "./Na3BatchId.controller";
import { Na3PeopleController } from "./Na3People.controller";
import { Na3ProductsController } from "./Na3Products.controller";

export class Na3Controller implements Na3 {
  private static _instance?: Na3Controller;
  readonly products = new Na3ProductsController();
  readonly people = new Na3PeopleController();
  readonly batchId = Na3BatchIdController;

  private constructor() {
    return;
  }

  static get(): Na3Controller {
    if (!Na3Controller._instance) Na3Controller._instance = new Na3Controller();
    return Na3Controller._instance;
  }
}
