import {
  Divider,
  MaintReportsFeatured,
  PageDescription,
  PageTitle,
} from "@components";
import { useNa3MaintReports } from "@modules/na3-react";
import React from "react";

export function MaintReportsHomePage(): JSX.Element {
  const { getAllMonthlyReports } = useNa3MaintReports();

  return (
    <>
      <PageTitle>Manutenção • Relatórios</PageTitle>
      <PageDescription>
        Emita relatórios de ordens de serviço e projetos de manutenção.
      </PageDescription>

      <Divider>Em destaque</Divider>

      <MaintReportsFeatured monthly={getAllMonthlyReports()} />

      <Divider />
    </>
  );
}
