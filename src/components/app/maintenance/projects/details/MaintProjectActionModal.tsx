import { Modal } from "antd";
import React, { useCallback } from "react";

import { useForm } from "../../../../../hooks";
import type { Na3MaintenanceProject } from "../../../../../modules/na3-types";
import { maintEmployeeSelectOptions } from "../../../../../utils";
import { Form } from "../../../../forms/Form";
import { FormField } from "../../../../forms/FormField/FormField";
import { SubmitButton } from "../../../../forms/SubmitButton";

type ActionFormType = "deliver" | "status";

type FormValues<T extends ActionFormType> = {
  author: string;
  message: T extends "status" ? string : string | null;
};

type MaintProjectActionModalProps<T extends ActionFormType> = {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (
    data: Na3MaintenanceProject,
    payload: FormValues<T>
  ) => Promise<void> | void;
  project: Na3MaintenanceProject;
  type: T;
};

export function MaintProjectActionModal<T extends ActionFormType>({
  type,
  isVisible,
  project,
  onSubmit,
  onClose,
}: MaintProjectActionModalProps<T>): JSX.Element {
  const form = useForm({
    defaultValues: { author: project.events[0]?.author || "", message: "" },
  });

  const handleSubmit = useCallback(
    (values: FormValues<T>) => {
      return onSubmit(project, values);
    },
    [onSubmit, project]
  );

  return (
    <Modal
      destroyOnClose={true}
      footer={null}
      onCancel={onClose}
      title={
        type === "status"
          ? "Informar status"
          : `Entregar ${project.isPredPrev ? "Pred/Prev" : "projeto"}`
      }
      visible={isVisible}
    >
      <Form form={form} onSubmit={handleSubmit}>
        <FormField
          label="Autor"
          name="author"
          options={maintEmployeeSelectOptions}
          rules={{ required: "Atribua um autor" }}
          type="select"
        />

        <FormField
          label={
            type === "status"
              ? `Status ${project.isPredPrev ? "da Pred/Prev" : "do projeto"}`
              : "Comentários"
          }
          name="message"
          required={type === "status"}
          rules={
            type === "status"
              ? {
                  required: `Descreva o status ${
                    project.isPredPrev ? "da Pred/Prev" : "do projeto"
                  }`,
                }
              : null
          }
          type="textArea"
        />

        <SubmitButton
          label={
            type === "status"
              ? "Compartilhar status"
              : `Entregar ${project.isPredPrev ? "Pred/Prev" : "projeto"}`
          }
          labelWhenLoading="Aguardando confirmação..."
        />
      </Form>
    </Modal>
  );
}
