import { Form, FormField, SubmitButton } from "@components";
import { useForm } from "@hooks";
import { useNa3Users } from "@modules/na3-react";
import type { Na3MaintenancePerson, Na3ServiceOrder } from "@modules/na3-types";
import {
  getMaintEmployeeSelectOptions,
  getPrioritySelectOptions,
} from "@utils";
import { Grid, Modal } from "antd";
import React, { useCallback, useMemo } from "react";

type FormValues = {
  assigneeUid: string;
  priority: NonNullable<Na3ServiceOrder["priority"]> | "";
};

type ConfirmServiceOrderModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (
    data: Na3ServiceOrder,
    payload: {
      assignee: Na3MaintenancePerson;
      priority: NonNullable<Na3ServiceOrder["priority"]>;
    }
  ) => Promise<void> | void;
  serviceOrder: Na3ServiceOrder;
};

export function ConfirmServiceOrderModal({
  isVisible,
  serviceOrder,
  onSubmit,
  onClose,
}: ConfirmServiceOrderModalProps): JSX.Element {
  const breakpoint = Grid.useBreakpoint();

  const {
    helpers: {
      getAllInDepartments: getAllUsersInDepartments,
      getByUid: getUserByUid,
    },
  } = useNa3Users();

  const form = useForm<FormValues>({
    defaultValues: { assigneeUid: "", priority: "" },
  });

  const handleAssigneeValidate = useCallback(
    (assigneeUid: string) => {
      if (!getUserByUid(assigneeUid))
        return "Não foi possível vincular um usuário ao manutentor definido.";
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
      if (values.priority === "") {
        form.setError("priority", { message: "Defina a prioridade." });
        return;
      }

      return onSubmit(serviceOrder, { assignee, priority: values.priority });
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
      title="Aceitar OS"
      visible={isVisible}
    >
      <Form form={form} onSubmit={handleSubmit}>
        <FormField
          label="Responsável"
          name={form.fieldNames.assigneeUid}
          options={maintEmployeeSelectOptions}
          rules={{
            required: "Defina o manutentor responsável",
            validate: handleAssigneeValidate,
          }}
          type="select"
        />

        <FormField
          label="Prioridade"
          name={form.fieldNames.priority}
          options={getPrioritySelectOptions()}
          rules={{ required: "Defina a prioridade" }}
          type={breakpoint.md ? "radio" : "select"}
        />

        <SubmitButton
          label="Aceitar OS"
          labelWhenLoading="Aguardando confirmação..."
        />
      </Form>
    </Modal>
  );
}
