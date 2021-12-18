import { blue, gold, green, red } from "@ant-design/colors";

export function getStatusColor(
  status: "error" | "primary" | "success" | "warning"
): string {
  switch (status) {
    case "primary":
      return blue[6];
    case "success":
      return green[6];
    case "warning":
      return gold[6];
    case "error":
      return red[5];
  }
}
