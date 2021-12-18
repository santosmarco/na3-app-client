import { EditOutlined } from "@ant-design/icons";
import { DocsCreateStdForm, ModalWide } from "@components";
import { useNa3StdDocs } from "@modules/na3-react";
import type { Na3StdDocument } from "@modules/na3-types";
import { Button } from "antd";
import React, { useCallback, useMemo, useState } from "react";

type DocsStdModifyButtonProps = {
  doc: Na3StdDocument;
  children: React.ReactNode;
  icon?: React.ReactNode;
  upgrade?: boolean;
};

export function DocsStdModifyButton({
  doc,
  children,
  icon,
  upgrade,
}: DocsStdModifyButtonProps): JSX.Element {
  const [formIsVisible, setFormIsVisible] = useState(false);

  const {
    helpers: { getDocumentLatestVersion },
  } = useNa3StdDocs();

  const docVersion = useMemo(
    () => getDocumentLatestVersion(doc),
    [getDocumentLatestVersion, doc]
  );

  const handleFormOpen = useCallback(() => {
    setFormIsVisible(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setFormIsVisible(false);
  }, []);

  const handleDocModify = useCallback(() => {
    handleFormClose();
  }, [handleFormClose]);

  return (
    <>
      <Button
        icon={icon || <EditOutlined />}
        onClick={handleFormOpen}
        type="primary"
      >
        {children}
      </Button>

      <ModalWide
        onClose={handleFormClose}
        title={children}
        visible={formIsVisible}
      >
        <DocsCreateStdForm
          editingDoc={doc}
          onSubmit={handleDocModify}
          upgrade={upgrade}
          version={docVersion}
        />
      </ModalWide>
    </>
  );
}
