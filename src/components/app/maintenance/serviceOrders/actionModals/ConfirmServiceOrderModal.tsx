import { Form, FormField, SubmitButton } from "@components";
import { useForm } from "@hooks";
import { useNa3Users } from "@modules/na3-react";
import type { Na3ServiceOrder } from "@modules/na3-types";
import {
  getMaintEmployeeSelectOptions,
  getPrioritySelectOptions,
} from "@utils";
import { Grid, Modal } from "antd";
import React, { useCallback, useMemo } from "react";

type FormValues = {
  assignee: string;
  priority: NonNullable<Na3ServiceOrder["priority"]> | "";
};

type ConfirmServiceOrderModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (
    data: Na3ServiceOrder,
    payload: FormValues
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
    helpers: { getAllInDepartments: getAllUsersInDepartments },
  } = useNa3Users();

  const form = useForm<FormValues>({
    defaultValues: { assignee: "", priority: "" },
  });

  const handleSubmit = useCallback(
    (values: FormValues) => {
      return onSubmit(serviceOrder, values);
    },
    [onSubmit, serviceOrder]
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
          name="assignee"
          options={maintEmployeeSelectOptions}
          rules={{ required: "Defina o manutentor responsável" }}
          type="select"
        />

        <FormField
          label="Prioridade"
          name="priority"
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
