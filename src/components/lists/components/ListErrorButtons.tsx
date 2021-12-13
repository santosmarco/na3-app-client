import { Button } from "antd";
import React, { useCallback, useState } from "react";

export function ListErrorButtons(): JSX.Element {
  const [isRefreshingPage, setIsRefreshingPage] = useState(false);

  const handleRefreshPage = useCallback(() => {
    setIsRefreshingPage(true);
    window.location.reload();
  }, []);

  const handleReportToDeveloper = useCallback(() => {
    window.location.href = "mailto:msantos@novaa3.com.br";
  }, []);

  return (
    <>
      <Button
        loading={isRefreshingPage}
        onClick={handleRefreshPage}
        type="primary"
      >
        {isRefreshingPage ? "Aguarde..." : "Atualizar página"}
      </Button>
      <Button disabled={isRefreshingPage} onClick={handleReportToDeveloper}>
        Reportar
      </Button>
    </>
  );
}
