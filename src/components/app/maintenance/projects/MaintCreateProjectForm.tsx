import { Divider, Grid, Modal, notification } from "antd";
import dayjs from "dayjs";
import React, { useCallback, useMemo } from "react";

import { EMPLOYEES } from "../../../../constants";
import { useForm } from "../../../../hooks";
import { useNa3MaintProjects } from "../../../../modules/na3-react";
import type { Na3MaintenanceProject } from "../../../../modules/na3-types";
import {
  createErrorNotifier,
  maintEmployeeSelectOptions,
  serviceOrderPrioritySelectOptions,
} from "../../../../utils";
import { Form } from "../../../forms/Form";
import { FormField } from "../../../forms/FormField/FormField";
import { SubmitButton } from "../../../forms/SubmitButton";

type MaintCreateProjectFormProps = {
  editingProject?: Na3MaintenanceProject;
  isPredPrev: boolean;
  onSubmit?: () => void;
};

const defaultProps = {
  editingProject: undefined,
  onSubmit: undefined,
};

type FormValues = {
  author: string;
  description: string;
  eta: string;
  priority: "" | "high" | "low" | "medium";
  teamManager: string;
  teamMembers: string[];
  title: string;
};

export function MaintCreateProjectForm({
  onSubmit,
  isPredPrev,
  editingProject,
}: MaintCreateProjectFormProps): JSX.Element {
  const breakpoint = Grid.useBreakpoint();

  const { helpers } = useNa3MaintProjects();

  const etaDefaultValue = useMemo((): string => {
    if (!editingProject) return "";

    const eta = dayjs(editingProject.eta.toDate()).startOf("day");
    if (eta.isBefore(dayjs().startOf("day"))) {
      return "";
    }
    return eta.format();
  }, [editingProject]);

  const form = useForm<FormValues>({
    defaultValues: {
      author: editingProject?.events[0].author || "",
      description: editingProject?.description || "",
      eta: etaDefaultValue,
      priority: editingProject?.priority || "",
      teamManager: editingProject?.team.manager || "",
      teamMembers:
        editingProject?.team.others.split(",").map((member) => member.trim()) ||
        [],
      title: editingProject?.title || "",
    },
  });

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      const notifyError = createErrorNotifier(
        `Erro ao ${editingProject ? "editar" : "criar"} o projeto`
      );

      if (editingProject) {
        const updateRes = await helpers.update(editingProject.id, {
          author: values.author,
          description: values.description,
          eta: dayjs(values.eta),
          internalId: editingProject.internalId,
          isPredPrev,
          priority: values.priority === "" ? "low" : values.priority,
          team: {
            manager: values.teamManager,
            members: values.teamMembers,
          },
          title: values.title,
        });

        if (updateRes.error) {
          notifyError(updateRes.error.message);
        } else {
          notification.success({
            description: (
              <>
                {isPredPrev ? "Pred/Prev" : "Projeto"}{" "}
                {helpers.formatInternalId(editingProject.internalId)}{" "}
                <em>({values.title.trim()})</em>{" "}
                {isPredPrev ? "atualizada" : "atualizado"} com sucesso!
              </>
            ),
            message: `${isPredPrev ? "Pred/Prev editada" : "Projeto editado"}`,
          });

          form.resetForm();
          onSubmit?.();
        }
      } else {
        const internalId = helpers.getNextInternalId();

        if (!internalId) {
          notifyError(
            "Não foi possível vincular um identificador ao projeto. Por favor, recarregue a página ou tente novamente mais tarde."
          );
          return;
        }

        const confirmModal = Modal.confirm({
          content: (
            <>
              Confirma a abertura do projeto{" "}
              {isPredPrev ? (
                <>
                  {" "}
                  <em>(Pred/Prev)</em>{" "}
                </>
              ) : (
                " "
              )}
              {helpers.formatInternalId(internalId)} —{" "}
              <em>{values.title.trim()}</em>?
            </>
          ),
          okText: `Abrir ${isPredPrev ? "Pred/Prev" : "projeto"}`,
          onOk: async () => {
            confirmModal.update({ okText: "Enviando..." });

            const addRes = await helpers.add(internalId, {
              author: values.author,
              description: values.description,
              eta: dayjs(values.eta),
              isPredPrev,
              priority: values.priority === "" ? "low" : values.priority,
              team: {
                manager: values.teamManager,
                members: values.teamMembers,
              },
              title: values.title,
            });

            if (addRes.error) {
              notifyError(addRes.error.message);
            } else {
              notification.success({
                description: (
                  <>
                    {isPredPrev ? "Pred/Prev" : "Projeto"}{" "}
                    {helpers.formatInternalId(internalId)}{" "}
                    <em>({values.title.trim()})</em>{" "}
                    {isPredPrev ? "aberta" : "aberto"} com sucesso!
                  </>
                ),
                message: `${
                  isPredPrev ? "Pred/Prev aberta" : "Projeto aberto"
                }`,
              });

              form.resetForm();
              onSubmit?.();
            }
          },
          title: `Abrir ${isPredPrev ? "Pred/Prev" : "projeto"}?`,
        });
      }
    },
    [form, helpers, onSubmit, isPredPrev, editingProject]
  );

  const handleDateHelpWhenValid = useCallback((dateString: string): string => {
    const daysFromToday = dayjs(dateString)
      .startOf("day")
      .diff(dayjs().startOf("day"), "days");

    return daysFromToday === 0
      ? "Hoje"
      : `Em ${daysFromToday} dia${daysFromToday === 1 ? "" : "s"}`;
  }, []);

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <FormField
        disabled={!!editingProject}
        label="Autor"
        name="author"
        options={maintEmployeeSelectOptions}
        rules={{ required: "Atribua um autor" }}
        type="select"
      />
      <FormField
        label="Título"
        name="title"
        rules={{ required: "Defina um título" }}
        type="input"
      />
      <FormField
        label="Descrição"
        name="description"
        rules={{ required: "Descreva o projeto" }}
        type="textArea"
      />

      <Divider />

      <FormField
        label="Responsável"
        name="teamManager"
        options={maintEmployeeSelectOptions}
        rules={{ required: "Defina o manutentor responsável" }}
        type="select"
      />
      <FormField
        label="Equipe"
        name="teamMembers"
        onTagProps={(value): { color?: string } => ({
          color: EMPLOYEES.MAINTENANCE.find(
            (maintainer) => maintainer.name === value
          )?.color,
        })}
        options={maintEmployeeSelectOptions}
        rules={{ required: "Selecione pelo menos um membro" }}
        sortValues={(a, b): number =>
          a.toLowerCase().localeCompare(b.toLowerCase())
        }
        type="select"
      />

      <Divider />

      <FormField
        label="Prioridade"
        name="priority"
        options={serviceOrderPrioritySelectOptions}
        rules={{ required: "Defina a prioridade" }}
        type={breakpoint.md ? "radio" : "select"}
      />

      <FormField
        disallowPastDates={true}
        helpWhenValid={handleDateHelpWhenValid}
        label="Previsão de entrega"
        name="eta"
        rules={{ required: "Defina a data prevista para a conclusão" }}
        type="date"
      />

      <SubmitButton
        label={`${
          editingProject
            ? "Salvar alterações"
            : `Abrir ${isPredPrev ? "Pred/Prev" : "projeto"}`
        }`}
        labelWhenLoading={`${
          editingProject
            ? "Salvando..."
            : `Enviando ${isPredPrev ? "Pred/Prev" : "projeto"}...`
        }`}
      />
    </Form>
  );
}

MaintCreateProjectForm.defaultProps = defaultProps;
