import type { Na3ServiceOrder } from "@modules/na3-types";

export function isNa3ServiceOrder(test: unknown): test is Na3ServiceOrder {
  return (
    typeof test === "object" &&
    test !== null &&
    Object.prototype.hasOwnProperty.call(test, "createdA") &&
    Object.prototype.hasOwnProperty.call(test, "machine") &&
    Object.prototype.hasOwnProperty.call(test, "maintenanceType") &&
    Object.prototype.hasOwnProperty.call(test, "dpt") &&
    Object.prototype.hasOwnProperty.call(test, "description") &&
    Object.prototype.hasOwnProperty.call(test, "cause") &&
    Object.prototype.hasOwnProperty.call(test, "team") &&
    Object.prototype.hasOwnProperty.call(test, "status")
  );
}
