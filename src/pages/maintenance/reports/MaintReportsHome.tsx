import { gold } from "@ant-design/colors";
import { StarTwoTone } from "@ant-design/icons";
import {
  Divider,
  MaintReportsFeatured,
  PageDescription,
  PageTitle,
} from "@components";
import { useDownload } from "@hooks";
import { useNa3MaintReports } from "@modules/na3-react";
import type { Na3MaintenanceReport } from "@modules/na3-types";
import { Button, Space } from "antd";
import React, { useCallback } from "react";

export function MaintReportsHomePage(): JSX.Element {
  const { getAllMonthlyReports, getCompleteReport, generateCsvReport } =
    useNa3MaintReports();

  const { download } = useDownload();

  const handleReportDownload = useCallback(
    async (report: Na3MaintenanceReport) => {
      const csvReportUri = await generateCsvReport(report);

      await download(
        csvReportUri,
        `Relatório Manutenção${report.title ? ` - ${report.title}` : ""}.csv`
      );
    },
    [generateCsvReport, download]
  );

  const handleCompleteReportDownload = useCallback(
    async () => handleReportDownload(getCompleteReport()),
    [getCompleteReport, handleReportDownload]
  );

  return (
    <>
      <PageTitle>Manutenção • Relatórios</PageTitle>
      <PageDescription>
        Emita relatórios de ordens de serviço e projetos de manutenção.
      </PageDescription>

      <Divider icon={<StarTwoTone twoToneColor={gold.primary} />}>
        Em destaque
      </Divider>

      <MaintReportsFeatured
        monthly={getAllMonthlyReports()}
        onDownload={handleReportDownload}
      />

      <Divider />

      <Space direction="vertical">
        <Button block={true} type="primary">
          Personalizar relatório
        </Button>

        <Button block={true} onClick={handleCompleteReportDownload}>
          Gerar relatório completo
        </Button>
      </Space>
    </>
  );
}
