import { Form, FormField, SubmitButton } from "@components";
import { useForm } from "@hooks";
import type { Na3ServiceOrder } from "@modules/na3-types";
import { Modal } from "antd";
import React, { useCallback } from "react";

type RejectSolutionModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (
    data: Na3ServiceOrder,
    payload: { reason: string }
  ) => Promise<void> | void;
  serviceOrder: Na3ServiceOrder;
};

export function RejectSolutionModal({
  isVisible,
  serviceOrder,
  onSubmit,
  onClose,
}: RejectSolutionModalProps): JSX.Element {
  const form = useForm({ defaultValues: { reason: "" } });

  const handleSubmit = useCallback(
    (values: { reason: string }) => {
      return onSubmit(serviceOrder, values);
    },
    [onSubmit, serviceOrder]
  );

  return (
    <Modal
      destroyOnClose={true}
      footer={null}
      onCancel={onClose}
      title="Recusar solução"
      visible={isVisible}
    >
      <Form form={form} onSubmit={handleSubmit}>
        <FormField
          label="Motivo"
          name="reason"
          rules={{ required: "Descreva o motivo para a recusa" }}
          type="textArea"
        />

        <SubmitButton
          label="Recusar solução"
          labelWhenLoading="Aguardando confirmação..."
        />
      </Form>
    </Modal>
  );
}
