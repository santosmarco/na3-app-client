import { blue, gold, green, red } from "@ant-design/colors";

export type AntdStatus = "error" | "primary" | "success" | "warning";

export function getStatusColor(status: AntdStatus): string {
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
