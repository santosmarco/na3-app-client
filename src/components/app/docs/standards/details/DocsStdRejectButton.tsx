import { Form, FormField, SubmitButton } from "@components";
import { useForm } from "@hooks";
import { Button, Modal } from "antd";
import React, { useCallback, useState } from "react";

type DocsStdRejectButtonProps = {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  modalTitle?: React.ReactNode;
  onRejectSubmit: (values: { reason: string }) => void;
};

export function DocsStdRejectButton({
  children,
  icon,
  modalTitle,
  onRejectSubmit,
}: DocsStdRejectButtonProps): JSX.Element {
  const [modalIsVisible, setModalIsVisible] = useState(false);

  const form = useForm({ defaultValues: { reason: "" } });

  const handleModalOpen = useCallback(() => {
    setModalIsVisible(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalIsVisible(false);
  }, []);

  return (
    <>
      <Button danger={true} icon={icon} type="text" onClick={handleModalOpen}>
        {children}
      </Button>

      <Modal
        destroyOnClose={true}
        footer={null}
        onCancel={handleModalClose}
        title={modalTitle}
        visible={modalIsVisible}
      >
        <Form form={form} onSubmit={onRejectSubmit}>
          <FormField
            type="textArea"
            name={form.fieldNames.reason}
            label="Comentários"
            rules={{ required: "Explique o motivo para a recusa do documento" }}
          />

          <SubmitButton
            label="Enviar recusa"
            labelWhenLoading="Aguardando confirmação..."
          />
        </Form>
      </Modal>
    </>
  );
}
