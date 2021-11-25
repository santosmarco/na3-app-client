import type { BatchId } from "../types";
import { Na3BatchId } from "./Na3BatchId.instance";

export function Na3BatchIdController(batchId: string): BatchId {
  return new Na3BatchId(batchId);
}
