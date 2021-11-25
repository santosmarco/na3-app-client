export function formatServiceOrderId(id: number | string): string {
  return id.toString().padStart(4, "0");
}
