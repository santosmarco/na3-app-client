import { Form, FormField, SubmitButton } from "@components";
import { useForm } from "@hooks";
import { useNa3Users } from "@modules/na3-react";
import type { Na3MaintenancePerson, Na3ServiceOrder } from "@modules/na3-types";
import { getMaintEmployeeSelectOptions } from "@utils";
import { Modal } from "antd";
import React, { useCallback, useMemo } from "react";

type ActionFormType = "deliver" | "status";

type FormValues = {
  assigneeUid: string;
  message: string;
};

type ServiceOrderSolutionActionsModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (
    data: Na3ServiceOrder,
    payload: { assignee: Na3MaintenancePerson; message: string }
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
  const {
    helpers: {
      getAllInDepartments: getAllUsersInDepartments,
      getByUid: getUserByUid,
    },
  } = useNa3Users();

  const assigneeUidDefaultValue = useMemo((): string => {
    if (!serviceOrder.assignedMaintainer) return "";
    if (typeof serviceOrder.assignedMaintainer === "string") {
      return serviceOrder.assignedMaintainer;
    }
    return serviceOrder.assignedMaintainer.uid;
  }, [serviceOrder.assignedMaintainer]);

  const form = useForm<FormValues>({
    defaultValues: {
      assigneeUid: assigneeUidDefaultValue,
      message: "",
    },
  });

  const handleAssigneeValidate = useCallback(
    (assigneeUid: string) => {
      if (!getUserByUid(assigneeUid))
        return "Não foi possível vincular um usuário ao responsável definido.";
    },
    [getUserByUid]
  );

  const handleSubmit = useCallback(
    (values: FormValues) => {
      const assignee = getUserByUid(values.assigneeUid);

      if (!assignee) {
        form.setError("assigneeUid", {
          message:
            "Não foi possível vincular um usuário ao responsável definido.",
        });
        return;
      }

      return onSubmit(serviceOrder, { assignee, message: values.message });
    },
    [form, serviceOrder, getUserByUid, onSubmit]
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
      title={type === "status" ? "Informar status" : "Transmitir solução"}
      visible={isVisible}
    >
      <Form form={form} onSubmit={handleSubmit}>
        <FormField
          disabled={!!getUserByUid(assigneeUidDefaultValue)}
          label="Responsável"
          name={form.fieldNames.assigneeUid}
          options={maintEmployeeSelectOptions}
          rules={{
            required: `Defina o responsável ${
              type === "status" ? "pelo informe" : "pela solução"
            }`,
            validate: handleAssigneeValidate,
          }}
          type="select"
        />

        <FormField
          label={type === "status" ? "Status" : "Solução"}
          name={form.fieldNames.message}
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
