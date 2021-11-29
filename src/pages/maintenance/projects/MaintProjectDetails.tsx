import {
  CheckOutlined,
  EditOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  DataItem,
  MaintCreateProjectForm,
  MaintEmployeeTag,
  MaintProjectActionModal,
  MaintProjectStatusBadge,
  MaintProjectTimeline,
  MaintProjectTimeRemaining,
  Page,
  PageActionButtons,
  PageAlert,
  PageDescription,
  PageTitle,
  PriorityTag,
  Result404,
} from "@components";
import { useBreadcrumb } from "@hooks";
import { useNa3MaintProjects } from "@modules/na3-react";
import type {
  Na3MaintenancePerson,
  Na3MaintenanceProject,
} from "@modules/na3-types";
import { createErrorNotifier, getMaintProjectsRootUrl } from "@utils";
import {
  Button,
  Col,
  Divider,
  Grid,
  Modal,
  notification,
  Row,
  Space,
} from "antd";
import { nanoid } from "nanoid";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

import classes from "./MaintProjectDetails.module.css";

type PageProps = {
  isPredPrev: boolean;
  projectId: string;
};

export function MaintProjectDetails({
  projectId,
  isPredPrev,
}: PageProps): JSX.Element {
  const [actionModalType, setActionModalType] = useState<
    "deliver" | "status"
  >();
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  const history = useHistory();
  const breakpoint = Grid.useBreakpoint();

  const { setExtra: setBreadcrumbExtra } = useBreadcrumb();

  const {
    loading,
    helpers: {
      formatInternalId,
      getProjectStatus,
      getById: getProjectById,
      shareProjectStatus,
      deliverProject,
    },
  } = useNa3MaintProjects();

  const project = useMemo(
    () => getProjectById(projectId),
    [getProjectById, projectId]
  );

  const projectStatus = useMemo(
    () => (project ? getProjectStatus(project) : undefined),
    [getProjectStatus, project]
  );

  const handleActionModalStatusOpen = useCallback(() => {
    setActionModalType("status");
  }, []);

  const handleActionModalDeliverOpen = useCallback(() => {
    setActionModalType("deliver");
  }, []);

  const handleEditModalOpen = useCallback(() => {
    setEditModalIsOpen(true);
  }, []);

  const handleActionModalClose = useCallback(() => {
    setActionModalType(undefined);
  }, []);

  const handleEditModalClose = useCallback(() => {
    setEditModalIsOpen(false);
  }, []);

  const handleProjectDeliver = useCallback(
    (
      project: Na3MaintenanceProject,
      actionPayload: { author: Na3MaintenancePerson; message: string | null }
    ) => {
      const confirmModal = Modal.confirm({
        content: (
          <>
            Confirma a entrega {isPredPrev ? "da Pred/Prev" : "do projeto"}{" "}
            {formatInternalId(project.internalId)} — <em>{project.title}</em>?
          </>
        ),
        okText: "Confirmar entrega",
        onOk: async () => {
          const notifyError = createErrorNotifier("Erro ao entregar o projeto");

          confirmModal.update({ okText: "Entregando..." });

          const operationRes = await deliverProject(project.id, {
            author: actionPayload.author,
            message: actionPayload.message,
          });

          if (operationRes.error) {
            notifyError(operationRes.error.message);
          } else {
            notification.success({
              description: (
                <>
                  {isPredPrev ? "Pred/Prev" : "Projeto"}{" "}
                  {formatInternalId(project.internalId)}{" "}
                  <em>({project.title.trim()})</em> entregue com sucesso!
                </>
              ),
              message: `${isPredPrev ? "Pred/Prev" : "Projeto"} entregue`,
            });
            setActionModalType(undefined);
            history.push(getMaintProjectsRootUrl({ isPredPrev }));
          }
        },
        title: `Entregar ${isPredPrev ? "Pred/Prev" : "projeto"}?`,
      });
    },
    [formatInternalId, deliverProject, history, isPredPrev]
  );

  const handleProjectShareStatus = useCallback(
    (
      project: Na3MaintenanceProject,
      actionPayload: { author: Na3MaintenancePerson; message: string }
    ) => {
      const confirmModal = Modal.confirm({
        content: (
          <>
            Confirma o seguinte status{" "}
            {isPredPrev ? "da Pred/Prev" : "do projeto"}{" "}
            {formatInternalId(project.internalId)}:{" "}
            <em>{actionPayload.message}</em>?
          </>
        ),
        okText: "Confirmar status",
        onOk: async () => {
          const notifyError = createErrorNotifier("Erro ao informar status");

          confirmModal.update({ okText: "Enviando status..." });

          if (!actionPayload.message) {
            notifyError("Mensagem de status inválida.");
            return;
          }

          const operationRes = await shareProjectStatus(project.id, {
            author: actionPayload.author,
            message: actionPayload.message,
          });

          if (operationRes.error) {
            notifyError(operationRes.error.message);
          } else {
            notification.success({
              description: (
                <>
                  Status {isPredPrev ? "da Pred/Prev" : "do projeto"}{" "}
                  {formatInternalId(project.internalId)}{" "}
                  <em>({project.title.trim()})</em> compartilhado com sucesso!
                </>
              ),
              message: "Status compartilhado",
            });
            setActionModalType(undefined);
            history.push(getMaintProjectsRootUrl({ isPredPrev }));
          }
        },
        title: "Compartilhar status?",
      });
    },
    [formatInternalId, shareProjectStatus, history, isPredPrev]
  );

  useEffect(() => {
    setBreadcrumbExtra(project && formatInternalId(project.internalId));
  }, [setBreadcrumbExtra, project, formatInternalId]);

  return project ? (
    <>
      <PageTitle pre={formatInternalId(project.internalId)}>
        {project.title}
      </PageTitle>

      {projectStatus !== "finished" && (
        <PageAlert
          className={classes.TimeRemainingAlert}
          closable={false}
          type={projectStatus === "late" ? "error" : "info"}
        >
          <MaintProjectTimeRemaining eta={project.eta} />
        </PageAlert>
      )}

      <PageDescription>{project.description}</PageDescription>

      {projectStatus !== "finished" && (
        <PageActionButtons
          left={
            <>
              <Button onClick={handleActionModalStatusOpen}>
                Informar status
              </Button>
              <Button
                icon={<CheckOutlined />}
                onClick={handleActionModalDeliverOpen}
                type="primary"
              >
                Entregar
                {breakpoint.md && ` ${isPredPrev ? "Pred/Prev" : "projeto"}`}
              </Button>
            </>
          }
          right={
            <Button
              className={classes.EditButton}
              icon={<EditOutlined />}
              onClick={handleEditModalOpen}
              type="link"
            >
              Editar
              {breakpoint.md && ` ${isPredPrev ? "Pred/Prev" : "projeto"}`}
            </Button>
          }
        />
      )}

      <Divider />

      <Row gutter={12}>
        <Col lg={6} xs={12}>
          <DataItem label="Status" marginBottom={!breakpoint.lg}>
            <MaintProjectStatusBadge
              isPredPrev={isPredPrev}
              status={projectStatus || "running"}
            />
          </DataItem>
        </Col>

        <Col lg={6} xs={12}>
          <DataItem label="Prioridade">
            <PriorityTag priority={project.priority} />
          </DataItem>
        </Col>

        <Col lg={6} xs={12}>
          <DataItem icon={<UserOutlined />} label="Responsável">
            <MaintEmployeeTag maintainer={project.team.manager} />
          </DataItem>
        </Col>

        <Col lg={6} xs={12}>
          <DataItem icon={<TeamOutlined />} label="Equipe">
            <Space size={4} wrap={true}>
              {typeof project.team.others === "string"
                ? project.team.others.trim()
                : project.team.others.map((other) => (
                    <MaintEmployeeTag
                      key={typeof other === "string" ? nanoid() : other.uid}
                      maintainer={other}
                    />
                  ))}
            </Space>
          </DataItem>
        </Col>
      </Row>

      <Divider />

      {breakpoint.lg ? (
        <Row className={classes.TimelineLgContainer}>
          <Col span={4}>
            <DataItem label="Histórico" />
          </Col>
          <Col className={classes.TimelineLg} span={19}>
            <Page scrollTopOffset={24}>
              <MaintProjectTimeline
                events={project.events}
                isPredPrev={isPredPrev}
              />
            </Page>
          </Col>
        </Row>
      ) : (
        <Page scrollTopOffset={24}>
          <Row>
            <Col span={24}>
              <DataItem label="Histórico" />
            </Col>

            <Col span={23}>
              <MaintProjectTimeline
                events={project.events}
                isPredPrev={isPredPrev}
              />
            </Col>
          </Row>
        </Page>
      )}

      <MaintProjectActionModal
        isVisible={!!actionModalType}
        onClose={handleActionModalClose}
        onSubmit={
          actionModalType === "status"
            ? handleProjectShareStatus
            : handleProjectDeliver
        }
        project={project}
        type={actionModalType || "status"}
      />

      <Modal
        destroyOnClose={true}
        footer={null}
        onCancel={handleEditModalClose}
        title="Editar projeto"
        visible={editModalIsOpen}
        width={breakpoint.lg ? "65%" : breakpoint.md ? "80%" : undefined}
      >
        <MaintCreateProjectForm
          editingProject={project}
          isPredPrev={isPredPrev}
          onSubmit={handleEditModalClose}
        />
      </Modal>
    </>
  ) : (
    <Result404
      backUrl={getMaintProjectsRootUrl({ isPredPrev })}
      isLoading={loading}
    >
      {isPredPrev ? "A Pred/Prev" : "O projeto de manutenção"}{" "}
      {isPredPrev ? "requisitada" : "requisitado"} não existe ou foi{" "}
      {isPredPrev ? "desabilitada" : "desabilitado"}.
    </Result404>
  );
}
