import { EditOutlined } from "@ant-design/icons";
import { DocsCreateStdForm, FormModal } from "@components";
import { useNa3StdDocs } from "@modules/na3-react";
import type { Na3StdDocument } from "@modules/na3-types";
import { Button } from "antd";
import React, { useCallback, useMemo, useState } from "react";

type DocsStdEditButtonProps = {
  doc: Na3StdDocument;
};

export function DocsStdEditButton({
  doc,
}: DocsStdEditButtonProps): JSX.Element {
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

  const handleDocEdit = useCallback(() => {
    return;
  }, []);

  return (
    <>
      <Button icon={<EditOutlined />} onClick={handleFormOpen} type="primary">
        Editar documento
      </Button>

      <FormModal
        onClose={handleFormClose}
        title="Teste"
        visible={formIsVisible}
      >
        <DocsCreateStdForm
          editingDoc={doc}
          onSubmit={handleDocEdit}
          version={docVersion}
        />
      </FormModal>
    </>
  );
}
