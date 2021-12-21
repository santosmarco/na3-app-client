import { CloseOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Info } from "@components";
import { useNa3StdDocs } from "@modules/na3-react";
import type { Na3StdDocument, Na3StdDocumentVersion } from "@modules/na3-types";
import { Button, notification, Space, Tooltip, Typography } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";

type TimelineVersionSummaryProps = {
  doc: Na3StdDocument;
  version: Na3StdDocumentVersion;
  versionUpgradeComment?: string | null | undefined;
};

export function TimelineVersionSummary({
  doc,
  version,
  versionUpgradeComment,
}: TimelineVersionSummaryProps): JSX.Element {
  const {
    helpers: { getDocumentVersionStatus, getDocumentVersionDownloadUrl },
  } = useNa3StdDocs();

  const versionStatus = useMemo(
    () => getDocumentVersionStatus(version),
    [getDocumentVersionStatus, version]
  );

  const versionFileIsAvailable = useMemo(
    () => versionStatus === "approved",
    [versionStatus]
  );

  const [versionFileUrl, setVersionFileUrl] = useState<string>();
  const [versionFileUrlIsLoading, setVersionFileUrlIsLoading] = useState(
    versionFileIsAvailable
  );
  const [versionFileUrlError, setVersionFileUrlError] = useState<string>();

  const handleAccessFileClick = useCallback(() => {
    if (!versionFileUrl || versionFileUrlError) {
      notification.error({
        message: "Erro ao acessar o documento",
        description:
          versionFileUrlError ||
          "Não foi possível vincular um link de acesso ao arquivo do documento. Por favor, entre em contato com o administrador do sistema.",
      });
      return;
    }
    window.open(versionFileUrl, "_blank");
  }, [versionFileUrl, versionFileUrlError]);

  useEffect(() => {
    if (versionFileUrl || !versionFileUrlIsLoading) return;

    void (async (): Promise<void> => {
      const downloadUrlRes = await getDocumentVersionDownloadUrl(doc, version);

      if (downloadUrlRes.error) {
        setVersionFileUrlError(downloadUrlRes.error.message);
      } else {
        setVersionFileUrl(downloadUrlRes.data);
      }

      setVersionFileUrlIsLoading(false);
    })();
  }, [
    versionFileUrl,
    versionFileUrlIsLoading,
    doc,
    version,
    getDocumentVersionDownloadUrl,
  ]);

  return (
    <>
      <Typography.Title level={4}>v.{version.number}</Typography.Title>

      <Typography.Paragraph italic={true} type="secondary">
        {versionUpgradeComment || "Esta foi a primeira versão desse documento."}
      </Typography.Paragraph>

      <Space size="small">
        <Tooltip
          color="red"
          placement="topLeft"
          title={
            versionFileIsAvailable &&
            versionFileUrlError && (
              <>
                <strong>
                  <InfoCircleOutlined /> Erro:{" "}
                </strong>
                {versionFileUrlError}
              </>
            )
          }
          visible={
            versionFileIsAvailable && versionFileUrlError ? undefined : false
          }
        >
          <Button
            danger={versionFileIsAvailable && !!versionFileUrlError}
            disabled={!versionFileIsAvailable}
            icon={
              versionFileIsAvailable && versionFileUrlError && <CloseOutlined />
            }
            loading={versionFileIsAvailable && versionFileUrlIsLoading}
            onClick={versionFileIsAvailable ? handleAccessFileClick : undefined}
            shape={
              versionFileIsAvailable && versionFileUrlError
                ? "round"
                : "default"
            }
            type={
              versionFileIsAvailable && versionFileUrlError ? "text" : "default"
            }
          >
            {versionFileIsAvailable
              ? versionFileUrlError
                ? "Documento não encontrado"
                : versionFileUrlIsLoading
                ? "Buscando documento..."
                : "Acessar documento"
              : "Documento indisponível"}
          </Button>
        </Tooltip>

        {!versionFileIsAvailable && (
          <Info>
            Somente os arquivos de versões <strong>aprovadas</strong> estão
            disponíveis para visualização.
          </Info>
        )}
      </Space>
    </>
  );
}
