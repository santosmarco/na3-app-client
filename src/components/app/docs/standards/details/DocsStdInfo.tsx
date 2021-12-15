import {
  DownloadOutlined,
  InfoCircleOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import {
  Collapse,
  DataItem,
  DocsStdAvatarGroup,
  DocsStdStatusBadge,
  DocsStdTypeTag,
} from "@components";
import { useNa3StdDocs } from "@modules/na3-react";
import type { Na3StdDocument } from "@modules/na3-types";
import { humanizeDuration } from "@utils";
import { Col, Grid, Row } from "antd";
import dayjs from "dayjs";
import React, { useMemo } from "react";

type DocsStdInfoProps = {
  doc: Na3StdDocument;
};

export function DocsStdInfo({ doc }: DocsStdInfoProps): JSX.Element {
  const breakpoint = Grid.useBreakpoint();

  const {
    helpers: {
      getDocumentLatestVersion,
      getDocumentAcknowledgedUsers,
      getDocumentDownloads,
      getDocumentStatus,
    },
  } = useNa3StdDocs();

  const docVersion = useMemo(
    () => getDocumentLatestVersion(doc),
    [getDocumentLatestVersion, doc]
  );

  const docStatus = useMemo(
    () => getDocumentStatus(doc),
    [getDocumentStatus, doc]
  );

  const docAcknowledgedUsers = useMemo(
    () => getDocumentAcknowledgedUsers(doc),
    [getDocumentAcknowledgedUsers, doc]
  );

  const docDownloads = useMemo(
    () => getDocumentDownloads(doc),
    [getDocumentDownloads, doc]
  );

  const noAvatarLabelMarginBottom = useMemo(
    () => (breakpoint.lg ? 3 : undefined),
    [breakpoint.lg]
  );

  return (
    <Collapse
      panels={[
        {
          header: "Informações",
          headerIcon: <InfoCircleOutlined />,
          content: (
            <Row>
              <Col lg={3} xs={8}>
                <DataItem
                  label="Tipo"
                  labelMarginBottom={noAvatarLabelMarginBottom}
                  marginBottom={!breakpoint.lg}
                >
                  <DocsStdTypeTag short={true} type={doc.type} />
                </DataItem>
              </Col>

              <Col lg={3} xs={8}>
                <DataItem
                  label="Código"
                  labelMarginBottom={noAvatarLabelMarginBottom}
                  marginBottom={!breakpoint.lg}
                >
                  {doc.code}
                </DataItem>
              </Col>

              <Col lg={3} xs={8}>
                <DataItem
                  label="Versão"
                  labelMarginBottom={noAvatarLabelMarginBottom}
                >
                  <em>
                    {docVersion ? `v.${docVersion.number}` : "Indeterminada"}
                  </em>
                </DataItem>
              </Col>

              <Col lg={3} xs={12}>
                <DataItem
                  label="Status"
                  labelMarginBottom={noAvatarLabelMarginBottom}
                  marginBottom={!breakpoint.lg}
                >
                  <DocsStdStatusBadge status={docStatus} variant="tag" />
                </DataItem>
              </Col>

              <Col lg={4} xs={12}>
                <DataItem
                  label="Próx. revisão"
                  labelMarginBottom={noAvatarLabelMarginBottom}
                >
                  {dayjs(doc.nextRevisionAt).format("DD/MM/YY")}{" "}
                  <small>
                    <em>({humanizeDuration(doc.nextRevisionAt)})</em>
                  </small>
                </DataItem>
              </Col>

              <Col lg={4} xs={12}>
                <DataItem icon={<ReadOutlined />} label="Lido por">
                  <DocsStdAvatarGroup data={docAcknowledgedUsers} />
                </DataItem>
              </Col>

              <Col lg={4} xs={12}>
                <DataItem icon={<DownloadOutlined />} label="Downloads">
                  <DocsStdAvatarGroup data={docDownloads} />
                </DataItem>
              </Col>
            </Row>
          ),
        },
      ]}
    />
  );
}
