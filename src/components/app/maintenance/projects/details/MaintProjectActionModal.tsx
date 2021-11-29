import { Form, FormField, SubmitButton } from "@components";
import { useForm } from "@hooks";
import { useNa3Users } from "@modules/na3-react";
import type {
  Na3MaintenancePerson,
  Na3MaintenanceProject,
} from "@modules/na3-types";
import { getMaintEmployeeSelectOptions } from "@utils";
import { Modal } from "antd";
import React, { useCallback, useMemo } from "react";

type ActionFormType = "deliver" | "status";

type FormValues = { authorUid: string; message: string };

type MaintProjectActionModalProps<T extends ActionFormType> = {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (
    data: Na3MaintenanceProject,
    payload: { author: Na3MaintenancePerson; message: string }
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
  const {
    helpers: {
      getAllInDepartments: getAllUsersInDepartments,
      getByUid: getUserByUid,
    },
  } = useNa3Users();

  const authorUidDefaultValue = useMemo((): string => {
    if (typeof project.events[0].author === "string") {
      return project.events[0].author;
    }
    return project.events[0].author.uid;
  }, [project.events]);

  const form = useForm<FormValues>({
    defaultValues: { authorUid: authorUidDefaultValue, message: "" },
  });

  const handleAuthorValidate = useCallback(
    (authorUid: string) => {
      if (!getUserByUid(authorUid))
        return "Não foi possível vincular um usuário ao autor atribuído.";
    },
    [getUserByUid]
  );

  const handleSubmit = useCallback(
    (values: FormValues) => {
      const author = getUserByUid(values.authorUid);

      if (!author) {
        form.setError("authorUid", {
          message: "Não foi possível vincular um usuário ao autor atribuído.",
        });
        return;
      }

      return onSubmit(project, { author, message: values.message });
    },
    [form, project, getUserByUid, onSubmit]
  );

  const maintEmployeeSelectOptions = useMemo(
    () => getMaintEmployeeSelectOptions(getAllUsersInDepartments("manutencao")),
    [getAllUsersInDepartments]
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
          name={form.fieldNames.authorUid}
          options={maintEmployeeSelectOptions}
          rules={{
            required: "Atribua um autor",
            validate: handleAuthorValidate,
          }}
          type="select"
        />

        <FormField
          label={
            type === "status"
              ? `Status ${project.isPredPrev ? "da Pred/Prev" : "do projeto"}`
              : "Comentários"
          }
          name={form.fieldNames.message}
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
