import type { Na3MaintenanceReportMonthly } from "@modules/na3-types";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { useCallback } from "react";

import { useNa3MaintProjects } from "./useNa3MaintProjects";
import { useNa3ServiceOrders } from "./useNa3ServiceOrders";

type UseNa3MaintReportsResult = {
  getAllMonthlyReports: () => Na3MaintenanceReportMonthly[];
};

export function useNa3MaintReports(): UseNa3MaintReportsResult {
  const serviceOrders = useNa3ServiceOrders();
  const maintProjects = useNa3MaintProjects();

  const getAllMonthlyReports = useCallback(() => {
    if (!(serviceOrders.data && maintProjects.data)) return [];

    const monthlyReports: Na3MaintenanceReportMonthly[] = [];

    [...serviceOrders.data, ...maintProjects.data].forEach((data) => {
      const dataIsServiceOrder = "createdAt" in data;

      const createdAt = dayjs(
        dataIsServiceOrder ? data.createdAt : data.events[0].timestamp.toDate()
      );
      const reportsSlot = monthlyReports.find(
        (report) =>
          report.month === createdAt.month() && report.year === createdAt.year()
      );

      if (reportsSlot) {
        if (dataIsServiceOrder) reportsSlot.serviceOrders.push(data);
        else reportsSlot.projects.push(data);
      } else {
        const newSlotBase = {
          month: createdAt.month(),
          year: createdAt.year(),
          serviceOrders: [],
          projects: [],
          id: nanoid(),
          title: "",
        };
        newSlotBase.title = dayjs(
          new Date(newSlotBase.year, newSlotBase.month)
        ).format("MMM/YY");

        if (dataIsServiceOrder) {
          monthlyReports.push({ ...newSlotBase, serviceOrders: [data] });
        } else {
          monthlyReports.push({ ...newSlotBase, projects: [data] });
        }
      }
    });

    return [...monthlyReports].sort((a, b) =>
      dayjs(new Date(b.year, b.month)).diff(new Date(a.year, a.month))
    );
  }, [serviceOrders.data, maintProjects.data]);

  return { getAllMonthlyReports };
}
