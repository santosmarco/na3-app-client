import { DataItem, UserPositionTag } from "@components";
import { useNa3Departments, useNa3Users } from "@modules/na3-react";
import type {
  Na3StdDocument,
  Na3StdDocumentPermissions,
} from "@modules/na3-types";
import { Col } from "antd";
import React, { useMemo } from "react";

import { DocsStdAvatarGroup } from "./DocsStdAvatarGroup";

type DocsStdPermissionsDataProps = {
  doc: Na3StdDocument;
  permissionId: keyof Na3StdDocumentPermissions;
  label: string;
  icon: React.ReactNode;
};

export function DocsStdPermissionsData({
  doc,
  permissionId,
  label,
  icon,
}: DocsStdPermissionsDataProps): JSX.Element {
  const {
    helpers: { getPositionsById },
  } = useNa3Departments();

  const {
    helpers: { getAllInPositions: getAllUsersInPositions },
  } = useNa3Users();

  const positionsWithPermission = useMemo(
    () => getPositionsById(doc.permissions.read),
    [getPositionsById, doc.permissions.read]
  );

  const usersWithPermission = useMemo(
    () => getAllUsersInPositions(doc.permissions[permissionId]),
    [getAllUsersInPositions, doc.permissions, permissionId]
  );

  return (
    <Col lg={6} xs={12}>
      <DataItem
        icon={icon}
        info={{
          variant: "popover",
          title: "Posições atribuídas",
          content: (
            <UserPositionTag position={positionsWithPermission} space={2} />
          ),
        }}
        label={label}
      >
        <DocsStdAvatarGroup data={usersWithPermission} />
      </DataItem>
    </Col>
  );
}
