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

import classes from "./DocsStdInfo.module.css";

type DocsStdInfoProps = {
  doc: Na3StdDocument;
  defaultOpen?: boolean;
};

export function DocsStdInfo({
  doc,
  defaultOpen,
}: DocsStdInfoProps): JSX.Element {
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

  return (
    <Collapse
      defaultOpen={defaultOpen}
      panels={[
        {
          header: "Informações",
          headerIcon: <InfoCircleOutlined />,
          content: (
            <Row>
              <Col lg={3} xs={8}>
                <DataItem label="Tipo" marginBottom={!breakpoint.lg}>
                  <div className={classes.DocData}>
                    <DocsStdTypeTag short={true} type={doc.type} />
                  </div>
                </DataItem>
              </Col>

              <Col lg={3} xs={8}>
                <DataItem label="Código" marginBottom={!breakpoint.lg}>
                  <div className={classes.DocData}>{doc.code}</div>
                </DataItem>
              </Col>

              <Col lg={3} xs={8}>
                <DataItem label="Versão">
                  <div className={classes.DocData}>
                    <em>
                      {docVersion ? `v.${docVersion.number}` : "Indeterminada"}
                    </em>
                  </div>
                </DataItem>
              </Col>

              <Col lg={3} xs={12}>
                <DataItem label="Status" marginBottom={!breakpoint.lg}>
                  <div className={classes.DocData}>
                    <DocsStdStatusBadge status={docStatus} variant="tag" />
                  </div>
                </DataItem>
              </Col>

              <Col lg={4} xs={12}>
                <DataItem label="Próx. revisão">
                  <div className={classes.DocData}>
                    <div>
                      {dayjs(doc.nextRevisionAt).format("DD/MM/YY")}{" "}
                      <small>
                        <em>({humanizeDuration(doc.nextRevisionAt)})</em>
                      </small>
                    </div>
                  </div>
                </DataItem>
              </Col>

              <Col lg={4} xs={12}>
                <DataItem icon={<ReadOutlined />} label="Lido por">
                  <div className={classes.DocData}>
                    <DocsStdAvatarGroup data={docAcknowledgedUsers} />
                  </div>
                </DataItem>
              </Col>

              <Col lg={4} xs={12}>
                <DataItem icon={<DownloadOutlined />} label="Downloads">
                  <div className={classes.DocData}>
                    <DocsStdAvatarGroup data={docDownloads} />
                  </div>
                </DataItem>
              </Col>
            </Row>
          ),
        },
      ]}
    />
  );
}
