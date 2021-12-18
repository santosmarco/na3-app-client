import {
  CheckOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  PrinterOutlined,
  ReadOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import {
  Collapse,
  DataItem,
  DocsStdStatusBadge,
  DocsStdTypeTag,
} from "@components";
import { useNa3StdDocs } from "@modules/na3-react";
import type { Na3StdDocument } from "@modules/na3-types";
import { humanizeDuration } from "@utils";
import { Col, Grid, Row, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import React, { useMemo } from "react";

import { DocsStdAvatarGroup } from "./DocsStdAvatarGroup";
import classes from "./DocsStdInfo.module.css";
import { DocsStdPermissionsData } from "./DocsStdPermissionsData";

type DocsStdInfoProps = {
  doc: Na3StdDocument;
  defaultOpen?: boolean;
  showPermissions?: boolean;
};

export function DocsStdInfo({
  doc,
  defaultOpen,
  showPermissions,
}: DocsStdInfoProps): JSX.Element {
  const breakpoint = Grid.useBreakpoint();

  const {
    helpers: {
      getDocumentLatestVersion,
      getDocumentStatus,
      getDocumentAcknowledgedUsers,
      getDocumentDownloads,
      checkDocumentIsOutdated,
    },
  } = useNa3StdDocs();

  const docVersion = useMemo(
    () => getDocumentLatestVersion(doc),
    [getDocumentLatestVersion, doc]
  );

  const docIsOutdated = useMemo(
    () => checkDocumentIsOutdated(doc),
    [checkDocumentIsOutdated, doc]
  );

  return (
    <Collapse
      defaultOpen={defaultOpen}
      expandIconPosition="right"
      panels={[
        {
          header: "Informações",
          icon: <InfoCircleOutlined />,
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
                    <DocsStdStatusBadge
                      status={getDocumentStatus(doc)}
                      variant="tag"
                    />
                  </div>
                </DataItem>
              </Col>

              <Col lg={4} xs={12}>
                <DataItem label="Próx. revisão">
                  <div className={classes.DocData}>
                    <div>
                      <Tooltip
                        color={docIsOutdated ? "red" : undefined}
                        placement={breakpoint.md ? "topLeft" : "topRight"}
                        title={
                          <Typography.Text italic={true}>
                            {humanizeDuration(doc.nextRevisionAt)}
                          </Typography.Text>
                        }
                      >
                        <Typography.Text
                          strong={docIsOutdated}
                          type={docIsOutdated ? "danger" : undefined}
                        >
                          {dayjs(doc.nextRevisionAt).format("DD/MM/YY")}
                        </Typography.Text>
                      </Tooltip>
                    </div>
                  </div>
                </DataItem>
              </Col>

              <Col lg={4} xs={12}>
                <DataItem icon={<ReadOutlined />} label="Lido por">
                  <div className={classes.DocData}>
                    <DocsStdAvatarGroup
                      data={getDocumentAcknowledgedUsers(doc)}
                    />
                  </div>
                </DataItem>
              </Col>

              <Col lg={4} xs={12}>
                <DataItem icon={<DownloadOutlined />} label="Downloads">
                  <div className={classes.DocData}>
                    <DocsStdAvatarGroup data={getDocumentDownloads(doc)} />
                  </div>
                </DataItem>
              </Col>
            </Row>
          ),
        },

        showPermissions && {
          header: "Permissões",
          icon: <UnlockOutlined />,
          content: (
            <Row>
              <DocsStdPermissionsData
                doc={doc}
                icon={<ReadOutlined />}
                label="Leitura"
                permissionId="read"
              />

              <DocsStdPermissionsData
                doc={doc}
                icon={<PrinterOutlined />}
                label="Impressão"
                permissionId="print"
              />

              <DocsStdPermissionsData
                doc={doc}
                icon={<DownloadOutlined />}
                label="Download"
                permissionId="download"
              />

              <DocsStdPermissionsData
                doc={doc}
                icon={<CheckOutlined />}
                label="Aprovação"
                permissionId="approve"
              />
            </Row>
          ),
        },
      ]}
    />
  );
}
