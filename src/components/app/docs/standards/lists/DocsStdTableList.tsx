import {
  DownloadOutlined,
  FilePdfOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import type { TableActionProps } from "@components";
import { DocsStdTypeTag, ResultSignIn, Table } from "@components";
import { useCurrentUser, useNa3StdDocs } from "@modules/na3-react";
import type { Na3StdDocument } from "@modules/na3-types";
import { NA3_STD_DOCUMENT_TYPES } from "@modules/na3-types";
import { Grid } from "antd";
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { DocsStdStatusBadge } from "../card/DocsStdStatusBadge";
import { DocsStdTableItemTitle } from "./DocsStdTableItemTitle";
import { DocsStdTableItemVersion } from "./DocsStdTableItemVersion";
import { DocsStdTableReadIndicator } from "./DocsStdTableReadIndicator";

type DocsStdTableListProps = {
  data: Na3StdDocument[] | null | undefined;
};

export function DocsStdTableList({
  data: docs,
}: DocsStdTableListProps): JSX.Element {
  const history = useHistory();
  const breakpoint = Grid.useBreakpoint();

  const currentUser = useCurrentUser();
  const {
    helpers: {
      getUserAcknowledgment,
      getDocumentStatus,
      getDocumentLatestApprovedVersion,
      userHasDocumentPermissions,
    },
  } = useNa3StdDocs();

  const handleDocReadIndicatorRender = useCallback(
    (data: Na3StdDocument): React.ReactNode =>
      currentUser && (
        <DocsStdTableReadIndicator
          hideLabel={!breakpoint.md}
          userHasAcknowledged={!!getUserAcknowledgment(data, currentUser)}
        />
      ),
    [breakpoint, currentUser, getUserAcknowledgment]
  );

  const handleDocTypeTagRender = useCallback(
    (data: Na3StdDocument): React.ReactNode => (
      <DocsStdTypeTag type={data.type} />
    ),
    []
  );

  const handleDocTitleRender = useCallback(
    (data: Na3StdDocument): React.ReactNode => (
      <DocsStdTableItemTitle doc={data} />
    ),
    []
  );

  const handleDocStatusRender = useCallback(
    (data: Na3StdDocument): React.ReactNode => (
      <DocsStdStatusBadge status={getDocumentStatus(data)} />
    ),
    [getDocumentStatus]
  );

  const handleDocVersionRender = useCallback(
    (data: Na3StdDocument): React.ReactNode => (
      <DocsStdTableItemVersion
        docVersion={getDocumentLatestApprovedVersion(data)}
      />
    ),
    [getDocumentLatestApprovedVersion]
  );

  const handleDocTitleSort = useCallback(
    (a: Na3StdDocument, b: Na3StdDocument): number => {
      return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    },
    []
  );

  const handleDocVersionSort = useCallback(
    (a: Na3StdDocument, b: Na3StdDocument): number => {
      return (
        (getDocumentLatestApprovedVersion(a)?.number || 0) -
        (getDocumentLatestApprovedVersion(b)?.number || 0)
      );
    },
    [getDocumentLatestApprovedVersion]
  );

  const handleNavigateToDocument = useCallback(
    (doc: Na3StdDocument, options?: { openViewer?: boolean }) => {
      history.push(
        `/docs/normas?id=${doc.id}${options?.openViewer ? "&view=true" : ""}`
      );
    },
    [history]
  );

  const handleRowClick = useCallback(
    (data: Na3StdDocument) => {
      handleNavigateToDocument(data);
    },
    [handleNavigateToDocument]
  );

  const handleActionsRender = useCallback(
    (data: Na3StdDocument): Array<TableActionProps<Na3StdDocument>> => {
      return [
        {
          title: "Visualizar",
          icon: <FilePdfOutlined />,
          onClick: (data): void => {
            handleNavigateToDocument(data, { openViewer: true });
          },
          disabled:
            !currentUser ||
            !userHasDocumentPermissions(currentUser, data, "read") ||
            getDocumentStatus(data) !== "approved",
        },
        {
          title: "Imprimir",
          icon: <PrinterOutlined />,
          onClick: (data): void => {
            console.log("Ver", data);
          },
          disabled:
            !currentUser ||
            !userHasDocumentPermissions(currentUser, data, "print"),
        },
        {
          title: "Baixar",
          icon: <DownloadOutlined />,
          onClick: (data): void => {
            console.log("Ver", data);
          },
          disabled:
            !currentUser ||
            !userHasDocumentPermissions(currentUser, data, "download"),
        },
      ];
    },
    [
      currentUser,
      userHasDocumentPermissions,
      getDocumentStatus,
      handleNavigateToDocument,
    ]
  );

  return currentUser ? (
    <Table
      columns={[
        {
          title: "Lido",
          render: handleDocReadIndicatorRender,
          filters: [
            {
              text: (
                <DocsStdTableReadIndicator
                  space={5}
                  userHasAcknowledged={true}
                />
              ),
              value: true,
            },
            {
              text: (
                <DocsStdTableReadIndicator
                  space={5}
                  userHasAcknowledged={false}
                />
              ),
              value: false,
            },
          ],
          onFilter: (value, data): boolean =>
            !!getUserAcknowledgment(data, currentUser) === value,
          align: breakpoint.md ? undefined : "center",
        },
        {
          title: "Tipo",
          dataIndex: "type",
          render: handleDocTypeTagRender,
          filters: Object.entries(NA3_STD_DOCUMENT_TYPES).map(
            ([typeId, type]) => ({
              text: <DocsStdTypeTag short={true} type={type} variant="dot" />,
              value: typeId,
            })
          ),
          onFilter: (value, data): boolean => data.type === value,
          responsive: ["md"],
        },
        {
          title: "Título",
          dataIndex: "title",
          render: handleDocTitleRender,
          onSort: handleDocTitleSort,
        },
        {
          title: "Status",
          render: handleDocStatusRender,
          filters: [
            {
              text: <DocsStdStatusBadge status="approved" />,
              value: "approved",
            },
            {
              text: <DocsStdStatusBadge status="pending" />,
              value: "pending",
            },
            {
              text: <DocsStdStatusBadge status="draft" />,
              value: "draft",
            },
            {
              text: <DocsStdStatusBadge status="rejected" />,
              value: "rejected",
            },
          ],
          onFilter: (value, data): boolean => getDocumentStatus(data) === value,
          responsive: ["lg"],
        },
        {
          title: "Versão",
          align: "center",
          render: handleDocVersionRender,
          onSort: handleDocVersionSort,
          responsive: ["lg"],
        },
      ]}
      dataSource={docs || []}
      onActionsRender={handleActionsRender}
      onRowClick={handleRowClick}
    />
  ) : (
    <ResultSignIn />
  );
}
