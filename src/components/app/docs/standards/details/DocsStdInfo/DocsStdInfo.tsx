import {
  CheckOutlined,
  DownloadOutlined,
  HistoryOutlined,
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
import type { AppUser } from "@modules/na3-react";
import type {
  Na3StdDocument,
  Na3StdDocumentEvent,
  Na3StdDocumentStatus,
  Na3StdDocumentVersion,
} from "@modules/na3-types";
import { humanizeDuration } from "@utils";
import { Col, Grid, Row, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import React from "react";

import { DocsStdTimeline } from "../DocsStdTimeline/DocsStdTimeline";
import { DocsStdAvatarGroup } from "./DocsStdAvatarGroup";
import classes from "./DocsStdInfo.module.css";
import { DocsStdPermissionsData } from "./DocsStdPermissionsData";

type DocEventRegistry = {
  event: Na3StdDocumentEvent;
  user: AppUser;
};

type DocsStdInfoProps = {
  defaultOpen?: boolean;
  doc: Na3StdDocument;
  docAcks: DocEventRegistry[];
  docDownloads: DocEventRegistry[];
  docIsOutdated: boolean;
  docStatus: Na3StdDocumentStatus | undefined;
  docVersion: Na3StdDocumentVersion | undefined;
  showPermissions?: boolean;
  showTimeline?: boolean;
};

export function DocsStdInfo({
  // Doc information
  doc,
  docVersion,
  docStatus,
  docIsOutdated,
  docAcks,
  docDownloads,
  // Options
  defaultOpen,
  showPermissions,
  showTimeline,
}: DocsStdInfoProps): JSX.Element {
  const breakpoint = Grid.useBreakpoint();

  return (
    <Collapse
      defaultOpen={defaultOpen}
      expandIconPosition="right"
      panels={[
        {
          header: "Informações",
          icon: <InfoCircleOutlined />,
          content: (
            <Row gutter={[12, 12]}>
              <Col lg={3} xs={12}>
                <DataItem label="Tipo">
                  <div className={classes.DocData}>
                    <DocsStdTypeTag short={true} type={doc.type} />
                  </div>
                </DataItem>
              </Col>

              <Col lg={3} xs={12}>
                <DataItem label={breakpoint.lg ? "Código" : "Código/Versão"}>
                  <div className={classes.DocData}>
                    {doc.code}
                    {!breakpoint.lg && docVersion && (
                      <>
                        {" "}
                        / <em>v.{docVersion.number}</em>
                      </>
                    )}
                  </div>
                </DataItem>
              </Col>

              <Col lg={3} xs={0}>
                <DataItem label="Versão">
                  <div className={classes.DocData}>
                    <em>
                      {docVersion ? `v.${docVersion.number}` : "Indeterminada"}
                    </em>
                  </div>
                </DataItem>
              </Col>

              <Col lg={3} xs={12}>
                <DataItem label="Status">
                  <div className={classes.DocData}>
                    {docStatus ? (
                      <DocsStdStatusBadge status={docStatus} variant="tag" />
                    ) : (
                      "Indeterminado"
                    )}
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
                    <DocsStdAvatarGroup data={docAcks} />
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

        showPermissions && {
          header: "Permissões",
          icon: <UnlockOutlined />,
          content: (
            <Row gutter={[12, 12]}>
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

        showTimeline && {
          header: "Histórico",
          icon: <HistoryOutlined />,
          content: <DocsStdTimeline doc={doc} />,
        },
      ]}
    />
  );
}
