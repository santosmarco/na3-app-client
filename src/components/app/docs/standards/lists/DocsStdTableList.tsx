import {
  DownloadOutlined,
  FilePdfOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import type { TableActions } from "@components";
import { DocsStdTypeTag, ResultSignIn, Table } from "@components";
import { useCurrentUser, useNa3StdDocs } from "@modules/na3-react";
import type {
  Na3StdDocument,
  Na3StdDocumentPermissions,
} from "@modules/na3-types";
import { NA3_STD_DOCUMENT_TYPES } from "@modules/na3-types";
import { capitalize } from "@utils";
import { Grid } from "antd";
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { DocsStdStatusBadge } from "../card/DocsStdStatusBadge";
import { DocsStdTableItemTitle } from "./DocsStdTableItemTitle";
import { DocsStdTableItemVersion } from "./DocsStdTableItemVersion";
import { DocsStdTableReadIndicator } from "./DocsStdTableReadIndicator";

type DocsStdTableListProps = {
  data: Na3StdDocument[] | null | undefined;
  onDocFileDownload: (doc: Na3StdDocument | undefined) => void;
};

export function DocsStdTableList({
  data: docs,
  onDocFileDownload,
}: DocsStdTableListProps): JSX.Element {
  const history = useHistory();
  const breakpoint = Grid.useBreakpoint();

  const currentUser = useCurrentUser();
  const {
    helpers: {
      getUserAcknowledgment,
      getDocumentStatus,
      getDocumentLatestApprovedVersion,
      getDocumentLatestVersionForUser,
      userHasDocumentPermissions,
      checkDocumentHasBeenReleased,
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
      <DocsStdTableItemVersion doc={data} />
    ),
    []
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
    (data: Na3StdDocument): TableActions<Na3StdDocument> => {
      const docHasBeenReleased = checkDocumentHasBeenReleased(data);

      function userHasDocPermission(
        permissionId: keyof Na3StdDocumentPermissions
      ): boolean {
        if (!currentUser) {
          return false;
        }

        const docVersionForUser = getDocumentLatestVersionForUser(
          data,
          currentUser
        );

        if (!docVersionForUser) {
          return false;
        }

        return userHasDocumentPermissions(
          currentUser,
          data,
          docVersionForUser,
          permissionId
        );
      }

      function checkActionIsAvailable(
        actionPermission: keyof Na3StdDocumentPermissions
      ): boolean {
        if (!currentUser || !docHasBeenReleased) {
          return false;
        }
        return userHasDocPermission(actionPermission);
      }

      function getActionTitle(
        actionId: "download" | "print" | "read",
        verb: string
      ): string {
        if (!userHasDocPermission(actionId)) {
          return (
            "Você não possui as permissões necessárias para " +
            verb +
            " esse documento"
          );
        }
        return capitalize(verb);
      }

      return {
        tooltip:
          !docHasBeenReleased && "Esse documento ainda não está disponível",
        disabled: !docHasBeenReleased,
        items: [
          {
            title: getActionTitle("read", "visualizar"),
            icon: <FilePdfOutlined />,
            onClick: (data): void => {
              handleNavigateToDocument(data, { openViewer: true });
            },
            disabled:
              !checkActionIsAvailable("read") ||
              getDocumentStatus(data) !== "approved",
          },
          {
            title: getActionTitle("print", "imprimir"),
            icon: <PrinterOutlined />,
            onClick: onDocFileDownload,
            disabled: !checkActionIsAvailable("print"),
          },
          {
            title: getActionTitle("download", "baixar"),
            icon: <DownloadOutlined />,
            onClick: onDocFileDownload,
            disabled: !checkActionIsAvailable("download"),
          },
        ],
      };
    },
    [
      currentUser,
      onDocFileDownload,
      getDocumentLatestVersionForUser,
      checkDocumentHasBeenReleased,
      userHasDocumentPermissions,
      getDocumentStatus,
      handleNavigateToDocument,
    ]
  );

  return currentUser ? (
    <Table
      actions={handleActionsRender}
      columns={[
        {
          title: "Lido",
          onRender: handleDocReadIndicatorRender,
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
          onRender: handleDocTypeTagRender,
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
          onRender: handleDocTitleRender,
          onSort: handleDocTitleSort,
        },
        {
          title: "Status",
          onRender: handleDocStatusRender,
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
          onRender: handleDocVersionRender,
          onSort: handleDocVersionSort,
          responsive: ["lg"],
        },
      ]}
      dataSource={docs || []}
      onRowClick={handleRowClick}
    />
  ) : (
    <ResultSignIn />
  );
}
