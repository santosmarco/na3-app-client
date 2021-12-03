import type { Na3MaintenanceProject } from "..";
import type { Na3ServiceOrder } from "./Na3ServiceOrder";

export type Na3MaintenanceReport = {
  id: string;
  projects: Na3MaintenanceProject[];
  serviceOrders: Na3ServiceOrder[];
  title: string;
};

export type Na3MaintenanceReportMonthly = Na3MaintenanceReport & {
  month: number;
  year: number;
};
