import type {
  Na3MaintenanceProject,
  Na3MaintenanceReport,
  Na3MaintenanceReportMonthly,
  Na3ServiceOrder,
} from "@modules/na3-types";
import { parseStringId } from "@utils";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { useCallback } from "react";
import type { FixedLengthArray } from "type-fest";

import { formatMilliseconds, prepareCsvData } from "../utils";
import { useNa3Departments } from "./useNa3Departments";
import { useNa3MaintProjects } from "./useNa3MaintProjects";
import { useNa3ServiceOrders } from "./useNa3ServiceOrders";

type ServiceOrdersCsvRow = FixedLengthArray<string, 25>;

type UseNa3MaintReportsResult = {
  generateCsvReport: (config: {
    projects?: Na3MaintenanceProject[];
    serviceOrders?: Na3ServiceOrder[];
  }) => Promise<string>;
  generateServiceOrdersCsvReport: (
    serviceOrders: Na3ServiceOrder[]
  ) => Promise<string>;
  getAllMonthlyReports: () => Na3MaintenanceReportMonthly[];
  getCompleteReport: () => Na3MaintenanceReport;
};

export function useNa3MaintReports(): UseNa3MaintReportsResult {
  const serviceOrders = useNa3ServiceOrders();
  const maintProjects = useNa3MaintProjects();

  const {
    helpers: { getById: getDepartmentById, getDepartmentMachineById },
  } = useNa3Departments();

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

  const getCompleteReport = useCallback((): Na3MaintenanceReport => {
    const monthlyReports = getAllMonthlyReports();

    return {
      id: nanoid(),
      title: "Completo",
      serviceOrders: monthlyReports.flatMap((monthly) => monthly.serviceOrders),
      projects: monthlyReports.flatMap((monthly) => monthly.projects),
    };
  }, [getAllMonthlyReports]);

  const generateServiceOrdersCsvReport = useCallback(
    (data: Na3ServiceOrder[]) => {
      return new Promise<string>((resolve) => {
        const header: ServiceOrdersCsvRow = [
          "Nº",
          "Data de abertura",
          "Status",
          "Setor",
          "Equipamento",
          "Manutentor",
          "Hora chamada",
          "Início da ocorrência",
          "Fim da ocorrência",
          "Hora encerrada",
          "Parou máquina?",
          "Parou linha?",
          "Parou produção?",
          "Descrição do problema",
          "Descrição do serviço",
          "Total de horas trabalhadas",
          "Horas para o início do serviço",
          "Tempo de máquina parada",
          "Tempo de produção parada",
          "OS encerrada?",
          "Tipo de manutenção",
          "Tempo de manutenção sem parada de máquina",
          "Produção Máquina / hora",
          "Perda est.",
          "Un.",
        ];

        const csvRows: ServiceOrdersCsvRow[] = data.map((d) => {
          const machine = getDepartmentMachineById(d.username, d.machine);
          const stops = serviceOrders.helpers.calculateStops(d);

          return [
            d.id,
            dayjs(d.createdAt).format("DD/MM/YY"),
            parseStringId(d.status),
            getDepartmentById(d.username)?.displayName.toUpperCase() || d.dpt,
            machine?.name || d.machine,
            typeof d.assignedMaintainer === "string"
              ? d.assignedMaintainer
              : d.assignedMaintainer?.displayName || "—",
            dayjs(d.createdAt).format("DD/MM/YY HH:mm:ss"),
            d.acceptedAt ? dayjs(d.acceptedAt).format("DD/MM/YY HH:mm:ss") : "",
            d.solvedAt ? dayjs(d.solvedAt).format("DD/MM/YY HH:mm:ss") : "",
            d.closedAt ? dayjs(d.closedAt).format("DD/MM/YY HH:mm:ss") : "",
            d.interruptions.equipment ? "SIM" : "NÃO",
            d.interruptions.line ? "SIM" : "NÃO",
            d.interruptions.production === true
              ? "SIM"
              : d.interruptions.production === false
              ? "NÃO"
              : "Indeterminado",
            d.description,
            d.solution || "",
            d.acceptedAt && d.solvedAt
              ? formatMilliseconds(dayjs(d.solvedAt).diff(d.acceptedAt))
              : "",
            d.acceptedAt
              ? formatMilliseconds(dayjs(d.acceptedAt).diff(d.createdAt))
              : "",
            formatMilliseconds(stops.machine),
            formatMilliseconds(stops.production),
            d.status === "closed" ? "SIM" : "NÃO",
            parseStringId(d.maintenanceType),
            stops.machine === 0 && d.acceptedAt && d.solvedAt
              ? formatMilliseconds(dayjs(d.solvedAt).diff(d.acceptedAt))
              : "",
            machine?.hourlyProdRate?.toString() || "",
            stops.loss?.toString() || "",
            machine?.prodUnit?.toUpperCase() || "",
          ];
        });

        const csvData = prepareCsvData([header, ...csvRows]);

        const csvUri = encodeURI("data:text/csv;charset=utf-8," + csvData);

        resolve(csvUri);
      });
    },
    [serviceOrders.helpers, getDepartmentById, getDepartmentMachineById]
  );

  const generateCsvReport = useCallback(
    async (config: {
      projects?: Na3MaintenanceProject[];
      serviceOrders?: Na3ServiceOrder[];
    }): Promise<string> => {
      const serviceOrdersReport = config?.serviceOrders
        ? await generateServiceOrdersCsvReport(config.serviceOrders)
        : "";

      return serviceOrdersReport;
    },
    [generateServiceOrdersCsvReport]
  );

  return {
    getAllMonthlyReports,
    generateCsvReport,
    generateServiceOrdersCsvReport,
    getCompleteReport,
  };
}
