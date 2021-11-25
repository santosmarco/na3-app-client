import { Modal } from "antd";
import React, { useCallback } from "react";

import { useForm } from "../../../../../hooks/useForm";
import type { Na3ServiceOrder } from "../../../../../modules/na3-types";
import { maintEmployeeSelectOptions } from "../../../../../utils";
import { Form } from "../../../../forms/Form";
import { FormField } from "../../../../forms/FormField/FormField";
import { SubmitButton } from "../../../../forms/SubmitButton";

type ActionFormType = "deliver" | "status";

type FormValues = {
  assignee: string;
  message: string;
};

type ServiceOrderSolutionActionsModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (
    data: Na3ServiceOrder,
    payload: FormValues
  ) => Promise<void> | void;
  serviceOrder: Na3ServiceOrder;
  type: ActionFormType;
};

export function ServiceOrderSolutionActionsModal({
  isVisible,
  serviceOrder,
  onSubmit,
  onClose,
  type,
}: ServiceOrderSolutionActionsModalProps): JSX.Element {
  const form = useForm<FormValues>({
    defaultValues: {
      assignee: serviceOrder.assignedMaintainer || "",
      message: "",
    },
  });

  const handleSubmit = useCallback(
    (values: FormValues) => {
      return onSubmit(serviceOrder, values);
    },
    [onSubmit, serviceOrder]
  );

  return (
    <Modal
      destroyOnClose={true}
      footer={null}
      onCancel={onClose}
      title={type === "status" ? "Informar status" : "Transmitir solução"}
      visible={isVisible}
    >
      <Form form={form} onSubmit={handleSubmit}>
        <FormField
          label="Responsável"
          name="assignee"
          options={maintEmployeeSelectOptions}
          rules={{
            required: `Defina o responsável ${
              type === "status" ? "pelo informe" : "pela solução"
            }`,
          }}
          type="select"
        />

        <FormField
          label={type === "status" ? "Status" : "Solução"}
          name="message"
          rules={{
            required: `Descreva ${
              type === "status" ? "o status" : "a solução"
            }`,
          }}
          type="textArea"
        />

        <SubmitButton
          label={type === "status" ? "Informar status" : "Entregar OS"}
          labelWhenLoading="Aguardando confirmação..."
        />
      </Form>
    </Modal>
  );
}
