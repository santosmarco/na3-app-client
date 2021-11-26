import { InfoCircleOutlined } from "@ant-design/icons";
import { Col, Divider, Grid, Modal, notification, Row } from "antd";
import React, { useCallback, useMemo, useState } from "react";

import { useForm } from "../../../../hooks";
import {
  useCurrentUser,
  useNa3Departments,
  useNa3ServiceOrders,
} from "../../../../modules/na3-react";
import type {
  Na3Department,
  Na3DepartmentId,
} from "../../../../modules/na3-types";
import { createErrorNotifier } from "../../../../utils";
import { Form } from "../../../forms/Form";
import { FormField } from "../../../forms/FormField/FormField";
import { SubmitButton } from "../../../forms/SubmitButton";
import { Result } from "../../../ui/Result/Result";
import classes from "./MaintCreateServiceOrderForm.module.css";

type MaintCreateServiceOrderFormProps = {
  onSubmit?: () => void;
};

const defaultProps = {
  onSubmit: undefined,
};

type FormValues = {
  additionalInfo: string;
  cause: "" | "eletrica" | "machineAdjustment" | "mecanica";
  departmentDisplayName: string;
  departmentId: Na3DepartmentId<"shop-floor"> | "";
  didStopLine: boolean;
  didStopMachine: boolean;
  didStopProduction: boolean;
  issue: string;
  machineId: string;
  maintenanceType: "" | "corretiva" | "preditiva" | "preventiva";
  team: "" | "eletrica" | "mecanica" | "predial";
};

export function MaintCreateServiceOrderForm({
  onSubmit,
}: MaintCreateServiceOrderFormProps): JSX.Element {
  const breakpoint = Grid.useBreakpoint();

  const user = useCurrentUser();
  const departments = useNa3Departments();
  const { helpers } = useNa3ServiceOrders();

  const userShopFloorDpts = useMemo(() => {
    const candidates = user?.getDepartmentsByType("shop-floor");

    if (candidates?.length === 0) {
      return departments.helpers.getByType("shop-floor");
    } else {
      return candidates;
    }
  }, [user, departments.helpers]);

  const [selectedDpt, setSelectedDpt] = useState<Na3Department<"shop-floor">>();
  const [didStopMachineDisabled, setDidStopMachineDisabled] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      additionalInfo: "",
      cause: "",
      departmentDisplayName:
        userShopFloorDpts?.length === 1
          ? userShopFloorDpts[0].displayName.trim().toUpperCase()
          : "",
      departmentId:
        userShopFloorDpts?.length === 1 ? userShopFloorDpts[0].id : "",
      didStopLine: false,
      didStopMachine: false,
      didStopProduction: false,
      issue: "",
      machineId: "",
      maintenanceType: "",
      team: "",
    },
  });

  const handleSubmit = useCallback(
    (values: FormValues) => {
      const notifyError = createErrorNotifier("Erro ao abrir a OS");

      const orderId = helpers.getNextId();

      if (!orderId) {
        notifyError(
          "Não foi possível vincular um número à OS. Por favor, recarregue a página ou tente novamente mais tarde."
        );
        return;
      }

      const confirmModal = Modal.confirm({
        content: (
          <>
            Confirma a abertura da OS #{orderId} —{" "}
            <em>{values.issue.trim()}</em>?
          </>
        ),
        okText: "Abrir OS",
        onOk: async () => {
          confirmModal.update({ okText: "Enviando..." });

          const operationRes = await helpers.add(orderId, {
            additionalInfo: values.additionalInfo,
            cause: values.cause,
            description: values.issue,
            dpt: values.departmentDisplayName,
            interruptions: {
              equipment: values.didStopMachine,
              line: values.didStopLine,
              production: values.didStopProduction,
            },
            machine: values.machineId,
            maintenanceType: values.maintenanceType,
            team: values.team,
            username: values.departmentId,
          });

          if (operationRes.error) {
            notifyError(operationRes.error.message);
          } else {
            notification.success({
              description: (
                <>
                  OS #{orderId} <em>({values.issue.trim()})</em> aberta com
                  sucesso!
                </>
              ),
              message: "OS aberta",
            });

            form.resetForm();
            onSubmit?.();
          }
        },
        title: "Abrir OS?",
      });
    },
    [form, helpers, onSubmit]
  );

  const handleDptChange = useCallback(
    (dptId: Na3DepartmentId<"shop-floor">): void => {
      form.setValue("departmentId", dptId);
      form.setValue("machineId", "");
      form.setValue("issue", "");

      setSelectedDpt(departments.helpers.getById(dptId));
    },
    [form, departments.helpers]
  );

  const handleForceDidStopMachine = useCallback(
    (switchValue: boolean): void => {
      if (switchValue) {
        form.setValue("didStopMachine", true);
      }

      const { didStopProduction, didStopLine } = form.getValues();

      if (didStopProduction || didStopLine) {
        setDidStopMachineDisabled(true);
      } else {
        setDidStopMachineDisabled(false);
      }
    },
    [form]
  );

  if (!user || !user.hasPrivileges("service_orders_write_shop_floor")) {
    return (
      <Result
        description="Sua conta não possui as permissões necessárias."
        status="error"
        title="Formulário desabilitado"
      />
    );
  }
  return (
    <Form form={form} onSubmit={handleSubmit}>
      <FormField
        disabled={true}
        hidden={true}
        label="Setor (ID)"
        name="departmentId"
        rules={null}
        type="input"
      />

      {userShopFloorDpts && userShopFloorDpts.length > 1 ? (
        <FormField
          label="Setor"
          name="departmentDisplayName"
          onValueChange={handleDptChange}
          options={userShopFloorDpts.map((dpt) => ({
            label: dpt.displayName.trim().toUpperCase(),
            value: dpt.id,
          }))}
          rules={{
            required:
              "Não foi possível verificar seu setor. Tente novamente mais tarde.",
          }}
          type="select"
        />
      ) : (
        <FormField
          disabled={true}
          label="Setor"
          name="departmentDisplayName"
          rules={null}
          type="input"
        />
      )}

      <FormField
        label="Máquina"
        name="machineId"
        options={
          selectedDpt?.machines
            ? Object.values(selectedDpt.machines)
                .sort((a, b) => a.number - b.number)
                .map((machine) => ({
                  label: (
                    <>
                      {machine.name} <em>({machine.id.toUpperCase()})</em>
                    </>
                  ),
                  value: machine.id,
                }))
            : []
        }
        rules={{ required: "Selecione uma máquina" }}
        type="select"
      />

      <FormField
        label="Descrição do problema"
        name="issue"
        options={
          selectedDpt?.machines
            ? Object.values(selectedDpt.machines)
                .flatMap((machine) => machine.issues)
                .filter((issue, idx, arr) => arr.indexOf(issue) === idx)
                .sort((a, b) => a.localeCompare(b))
                .map((issue) => ({ label: issue.toUpperCase(), value: issue }))
            : []
        }
        rules={{ required: "Descreva o problema" }}
        tooltip={{
          icon: <InfoCircleOutlined />,
          title: (
            <>
              <strong>Lembre-se!</strong> Dê sempre preferência aos problemas
              pré-definidos
            </>
          ),
        }}
        type="autoComplete"
      />

      <Divider className={classes.FormDivider} />

      <Row gutter={36}>
        <Col lg={8} xs={24}>
          <FormField
            label="Parou produção?"
            labelSpan={16}
            name="didStopProduction"
            onValueChange={handleForceDidStopMachine}
            rules={null}
            type="switch"
          />
        </Col>

        <Col lg={8} xs={24}>
          <FormField
            label="Parou linha?"
            labelSpan={16}
            name="didStopLine"
            onValueChange={handleForceDidStopMachine}
            rules={null}
            type="switch"
          />
        </Col>

        <Col lg={8} xs={24}>
          <FormField
            disabled={didStopMachineDisabled}
            label="Parou máquina?"
            labelSpan={16}
            name="didStopMachine"
            rules={null}
            type="switch"
          />
        </Col>
      </Row>

      <Divider className={classes.FormDivider} />

      <FormField
        label="Equipe responsável"
        name="team"
        options={[
          { label: "Elétrica", value: "eletrica" },
          { label: "Mecânica", value: "mecanica" },
          { label: "Predial", value: "predial" },
        ]}
        rules={{ required: "Defina a equipe responsável" }}
        type={breakpoint.md ? "radio" : "select"}
      />

      <FormField
        label="Tipo de manutenção"
        name="maintenanceType"
        options={[
          { label: "Corretiva", value: "corretiva" },
          { label: "Preventiva", value: "preventiva" },
          { label: "Preditiva", value: "preditiva" },
        ]}
        rules={{ required: "Defina o tipo de manutenção" }}
        type={breakpoint.md ? "radio" : "select"}
      />

      <FormField
        label="Tipo de causa"
        name="cause"
        options={[
          { label: "Elétrica", value: "eletrica" },
          { label: "Mecânica", value: "mecanica" },
          { label: "Ajuste de máquina", value: "machineAdjustment" },
        ]}
        rules={{ required: "Defina o tipo de causa" }}
        type={breakpoint.md ? "radio" : "select"}
      />

      <Divider className={classes.FormDivider} />

      <FormField
        label="Informações adicionais"
        name="additionalInfo"
        required={false}
        rules={null}
        type="textArea"
      />

      <SubmitButton label="Abrir OS" labelWhenLoading="Enviando OS..." />
    </Form>
  );
}

MaintCreateServiceOrderForm.defaultProps = defaultProps;
