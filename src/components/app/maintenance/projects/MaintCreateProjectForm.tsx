import { Form, FormField, SubmitButton } from "@components";
import { useForm } from "@hooks";
import { useNa3MaintProjects, useNa3Users } from "@modules/na3-react";
import type { Na3MaintenanceProject } from "@modules/na3-types";
import {
  createErrorNotifier,
  getMaintEmployeeSelectOptions,
  getPrioritySelectOptions,
} from "@utils";
import { Divider, Grid, Modal, notification } from "antd";
import dayjs from "dayjs";
import React, { useCallback, useMemo } from "react";

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
  authorUid: string;
  description: string;
  eta: string;
  priority: "" | "high" | "low" | "medium";
  teamManagerUid: string;
  teamMemberUids: string[];
  title: string;
};

export function MaintCreateProjectForm({
  onSubmit,
  isPredPrev,
  editingProject,
}: MaintCreateProjectFormProps): JSX.Element {
  const breakpoint = Grid.useBreakpoint();

  const { helpers } = useNa3MaintProjects();
  const {
    helpers: {
      getAllInDepartments: getAllUsersInDepartments,
      getByUid: getUserByUid,
    },
    currentUser,
  } = useNa3Users();

  const authorUidDefaultValue = useMemo((): string => {
    if (!editingProject) return currentUser?.uid || "";

    if (typeof editingProject.events[0].author === "string") {
      return editingProject.events[0].author;
    }
    return editingProject.events[0].author.uid;
  }, [editingProject, currentUser]);

  const teamManagerUidDefaultValue = useMemo((): string => {
    if (!editingProject) return "";

    if (typeof editingProject.team.manager === "string") {
      return editingProject.team.manager;
    }
    return editingProject.team.manager.uid;
  }, [editingProject]);

  const teamMemberUidsDefaultValue = useMemo((): string[] => {
    if (
      !editingProject?.team.others ||
      typeof editingProject.team.others === "string"
    ) {
      return [];
    }
    return editingProject.team.others.map((teamMember) =>
      typeof teamMember === "string" ? teamMember : teamMember.uid
    );
  }, [editingProject?.team.others]);

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
      authorUid: authorUidDefaultValue,
      description: editingProject?.description || "",
      eta: etaDefaultValue,
      priority: editingProject?.priority || "",
      teamManagerUid: teamManagerUidDefaultValue,
      teamMemberUids: teamMemberUidsDefaultValue,
      title: editingProject?.title || "",
    },
  });

  const handleAuthorValidate = useCallback(
    (authorUid: string) => {
      if (!getUserByUid(authorUid))
        return "Não foi possível vincular um usuário ao autor atribuído.";
    },
    [getUserByUid]
  );

  const handleTeamManagerValidate = useCallback(
    (teamManagerUid: string) => {
      if (!getUserByUid(teamManagerUid))
        return "Não foi possível vincular um usuário ao responsável definido.";
    },
    [getUserByUid]
  );

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      const notifyError = createErrorNotifier(
        `Erro ao ${editingProject ? "editar" : "criar"} o projeto`
      );

      const author = getUserByUid(values.authorUid);
      const teamManager = getUserByUid(values.teamManagerUid);
      const teamMembers = values.teamMemberUids.map(
        (input) => getUserByUid(input) || input
      );

      if (!author) {
        form.setError("authorUid", {
          message: "Não foi possível vincular um usuário ao autor atribuído.",
        });
        return;
      }
      if (!teamManager) {
        form.setError("teamManagerUid", {
          message:
            "Não foi possível vincular um usuário ao responsável definido.",
        });
        return;
      }

      if (editingProject) {
        const updateRes = await helpers.update(editingProject.id, {
          author: author,
          description: values.description,
          eta: dayjs(values.eta),
          internalId: editingProject.internalId,
          isPredPrev,
          priority: values.priority === "" ? "low" : values.priority,
          team: { manager: teamManager, members: teamMembers },
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
              author: author,
              description: values.description,
              eta: dayjs(values.eta),
              isPredPrev,
              priority: values.priority === "" ? "low" : values.priority,
              team: { manager: teamManager, members: teamMembers },
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
    [form, helpers, onSubmit, isPredPrev, editingProject, getUserByUid]
  );

  const handleDateHelpWhenValid = useCallback((dateString: string): string => {
    const daysFromToday = dayjs(dateString)
      .startOf("day")
      .diff(dayjs().startOf("day"), "days");

    return daysFromToday === 0
      ? "Hoje"
      : `Em ${daysFromToday} dia${daysFromToday === 1 ? "" : "s"}`;
  }, []);

  const maintEmployeeSelectOptions = useMemo(
    () => getMaintEmployeeSelectOptions(getAllUsersInDepartments("manutencao")),
    [getAllUsersInDepartments]
  );

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <FormField
        disabled={!!(editingProject && getUserByUid(authorUidDefaultValue))}
        label="Autor"
        name={form.fieldNames.authorUid}
        options={maintEmployeeSelectOptions}
        rules={{ required: "Atribua um autor", validate: handleAuthorValidate }}
        type="select"
      />
      <FormField
        label="Título"
        name={form.fieldNames.title}
        rules={{ required: "Defina um título" }}
        type="input"
      />
      <FormField
        label="Descrição"
        name={form.fieldNames.description}
        rules={{
          required: `Descreva ${isPredPrev ? "a Pred/Prev" : "o projeto"}`,
        }}
        type="textArea"
      />

      <Divider />

      <FormField
        label="Responsável"
        name={form.fieldNames.teamManagerUid}
        options={maintEmployeeSelectOptions}
        rules={{
          required: `Defina o responsável ${
            isPredPrev ? "pela Pred/Prev" : "pelo projeto"
          }`,
          validate: handleTeamManagerValidate,
        }}
        type="select"
      />
      <FormField
        label="Equipe"
        name={form.fieldNames.teamMemberUids}
        onTagProps={(value): { color?: string } => ({
          color: getUserByUid(value)?.style.webColor,
        })}
        options={maintEmployeeSelectOptions}
        rules={{ required: "Selecione pelo menos um membro" }}
        type="select"
      />

      <Divider />

      <FormField
        label="Prioridade"
        name={form.fieldNames.priority}
        options={getPrioritySelectOptions()}
        rules={{ required: "Defina a prioridade" }}
        type={breakpoint.md ? "radio" : "select"}
      />

      <FormField
        disallowPastDates={true}
        helpWhenValid={handleDateHelpWhenValid}
        label="Previsão de entrega"
        name={form.fieldNames.eta}
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
