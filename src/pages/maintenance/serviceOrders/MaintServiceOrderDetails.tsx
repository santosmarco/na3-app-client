import {
  CheckOutlined,
  CloseOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import {
  ConfirmServiceOrderModal,
  DataItem,
  Divider,
  MaintEmployeeTag,
  MaintServiceOrderTimelineModal,
  Page,
  PageActionButtons,
  PageDescription,
  PageTitle,
  PriorityTag,
  RejectSolutionModal,
  Result404,
  ServiceOrderMachineTag,
  ServiceOrderSolutionActionsModal,
  ServiceOrderStatusBadge,
} from "@components";
import type { AppRoutePath } from "@config";
import { useBreadcrumb } from "@hooks";
import { useCurrentUser, useNa3ServiceOrders } from "@modules/na3-react";
import type { Na3MaintenancePerson, Na3ServiceOrder } from "@modules/na3-types";
import {
  createErrorNotifier,
  getMaintPersonDisplayName,
  parseStringId,
} from "@utils";
import {
  Button,
  Col,
  Grid,
  Modal,
  notification,
  Row,
  Space,
  Typography,
} from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";

import classes from "./MaintServiceOrderDetails.module.css";

type PageProps = {
  hasCameFromDashboard: boolean;
  serviceOrderId: string;
};

export function MaintServiceOrderDetailsPage({
  serviceOrderId,
  hasCameFromDashboard,
}: PageProps): JSX.Element {
  const [rejectSolutionModalIsVisible, setRejectSolutionModalIsVisible] =
    useState(false);
  const [acceptOrderModalIsVisible, setAcceptOrderModalIsVisible] =
    useState(false);
  const [solutionActionModalType, setSolutionActionModalType] = useState<
    "deliver" | "status"
  >();

  const [timelineIsVisible, setTimelineIsVisible] = useState(false);

  const history = useHistory();
  const breakpoint = Grid.useBreakpoint();

  const { setExtra: setBreadcrumbExtra } = useBreadcrumb();

  const user = useCurrentUser();
  const {
    loading,
    helpers: {
      getById: getServiceOrderById,
      getOrderMachine,
      orderRequiresAction,
      acceptSolution: acceptOrderSolution,
      rejectSolution: rejectOrderSolution,
      confirm: confirmServiceOrder,
      shareStatus: shareOrderSolutionStatus,
      deliver: deliverServiceOrder,
    },
  } = useNa3ServiceOrders();

  const backUrl = useMemo(
    (): AppRoutePath =>
      `/manutencao/${hasCameFromDashboard ? "dashboard" : "os"}`,
    [hasCameFromDashboard]
  );

  const serviceOrder = useMemo(
    () => getServiceOrderById(serviceOrderId),
    [getServiceOrderById, serviceOrderId]
  );

  const handleTimelineOpen = useCallback(() => {
    setTimelineIsVisible(true);
  }, []);

  const handleTimelineClose = useCallback(() => {
    setTimelineIsVisible(false);
  }, []);

  const handleOrderSolutionAccept = useCallback(() => {
    if (!serviceOrder) return;

    const confirmModal = Modal.confirm({
      content: `Esta a????o encerrar?? a OS #${serviceOrder.id}.`,
      okText: "Encerrar OS",
      onOk: async () => {
        confirmModal.update({ okText: "Encerrando OS..." });

        const operationRes = await acceptOrderSolution(serviceOrder.id);

        if (operationRes.error) {
          notification.error({
            description: operationRes.error.message,
            message: "Erro ao encerrar a OS",
          });
        } else {
          notification.success({
            description: (
              <>
                OS #{serviceOrder.id} <em>({serviceOrder.description})</em>{" "}
                encerrada com sucesso!
              </>
            ),
            message: "OS encerrada",
          });
          history.push(backUrl);
        }
      },
      title: "Aceitar solu????o?",
    });
  }, [serviceOrder, acceptOrderSolution, history, backUrl]);

  const handleOrderSolutionReject = useCallback(
    async (data: Na3ServiceOrder, payload: { reason: string }) => {
      return new Promise<void>((resolve) => {
        const confirmModal = Modal.confirm({
          content: (
            <>
              Confirma a recusa da{data.solution ? " seguinte" : ""} solu????o da
              OS #{data.id}
              {data.solution && (
                <>
                  : <em>{data.solution.trim()}</em>
                </>
              )}
              ?
            </>
          ),
          okText: "Confirmar recusa",
          onCancel: () => {
            resolve();
          },
          onOk: async () => {
            confirmModal.update({ okText: "Enviando recusa..." });

            const operationRes = await rejectOrderSolution(data.id, payload);

            if (operationRes.error) {
              notification.error({
                description: operationRes.error.message,
                message: "Erro ao recusar solu????o",
              });
            } else {
              notification.info({
                description: (
                  <>
                    Solu????o da OS #{data.id} <em>({data.description})</em>{" "}
                    recusada.
                  </>
                ),
                message: "Solu????o recusada",
              });
              history.push(backUrl);
            }

            resolve();
          },
          title: "Recusar solu????o?",
        });
      });
    },
    [rejectOrderSolution, history, backUrl]
  );

  const handleOrderConfirm = useCallback(
    (
      data: Na3ServiceOrder,
      payload: {
        assignee: Na3MaintenancePerson;
        priority: NonNullable<Na3ServiceOrder["priority"]>;
      }
    ) => {
      const confirmModal = Modal.confirm({
        content: (
          <>
            <>Confirma o aceite da OS #{data.id}?</>
            <Divider />
            <Row>
              <Col span={10}>
                <strong>Respons??vel:</strong>
              </Col>
              <Col>
                <Typography.Paragraph
                  className={classes.ConfirmModalSummaryItem}
                >
                  {getMaintPersonDisplayName(payload.assignee)}
                </Typography.Paragraph>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <strong>Prioridade:</strong>
              </Col>
              <Col>
                <Typography.Paragraph>
                  <PriorityTag priority={payload.priority} type="dot" />
                </Typography.Paragraph>
              </Col>
            </Row>
          </>
        ),
        okText: "Aceitar OS",
        onOk: async () => {
          const notifyError = createErrorNotifier("Erro ao aceitar a OS");

          confirmModal.update({ okText: "Enviando..." });

          const operationRes = await confirmServiceOrder(data.id, {
            ...payload,
          });

          if (operationRes.error) {
            notifyError(operationRes.error.message);
          } else {
            notification.success({
              description: (
                <>
                  OS #{data.id} <em>({data.description})</em> aceita com
                  sucesso!
                </>
              ),
              message: "OS aceita",
            });
            history.push(backUrl);
          }
        },
        title: "Aceitar OS?",
      });
    },
    [confirmServiceOrder, history, backUrl]
  );

  const handleOrderSolutionShareStatus = useCallback(
    (
      data: Na3ServiceOrder,
      payload: { assignee: Na3MaintenancePerson; message: string }
    ) => {
      const confirmModal = Modal.confirm({
        content: (
          <>
            Confirma o seguinte status da OS #{data.id}:{" "}
            <em>{payload.message}</em>?
          </>
        ),
        okText: "Confirmar status",
        onOk: async () => {
          confirmModal.update({ okText: "Enviando status..." });

          const operationRes = await shareOrderSolutionStatus(data.id, {
            assignee: payload.assignee,
            status: payload.message.trim(),
          });

          if (operationRes.error) {
            notification.error({
              description: operationRes.error.message,
              message: "Erro ao informar status",
            });
          } else {
            notification.success({
              description: (
                <>
                  Status da OS #{data.id} <em>({data.description})</em>{" "}
                  compartilhado com sucesso!
                </>
              ),
              message: "Status compartilhado",
            });
            history.push(backUrl);
          }
        },
        title: "Compartilhar status?",
      });
    },
    [shareOrderSolutionStatus, history, backUrl]
  );

  const handleOrderDeliver = useCallback(
    (
      data: Na3ServiceOrder,
      payload: { assignee: Na3MaintenancePerson; message: string }
    ) => {
      const confirmModal = Modal.confirm({
        content: (
          <>
            Confirma a seguinte solu????o para a OS #{data.id}:{" "}
            <em>{payload.message}</em>?
          </>
        ),
        okText: "Transmitir solu????o",
        onOk: async () => {
          confirmModal.update({ okText: "Enviando solu????o..." });

          const operationRes = await deliverServiceOrder(data.id, {
            assignee: payload.assignee,
            solution: payload.message.trim(),
          });

          if (operationRes.error) {
            notification.error({
              description: operationRes.error.message,
              message: "Erro ao transmitir solu????o",
            });
          } else {
            notification.success({
              description: (
                <>
                  Solu????o da OS #{data.id} <em>({data.description})</em>{" "}
                  transmitida com sucesso!
                </>
              ),
              message: "Solu????o transmitida",
            });
            history.push(backUrl);
          }
        },
        title: "Transmitir solu????o?",
      });
    },
    [deliverServiceOrder, history, backUrl]
  );

  useEffect(() => {
    setBreadcrumbExtra(serviceOrder && `#${serviceOrder.id}`);
  }, [setBreadcrumbExtra, serviceOrder]);

  return serviceOrder ? (
    <>
      <PageTitle>OS #{serviceOrder.id}</PageTitle>
      <PageDescription>{serviceOrder.description}</PageDescription>

      {((user?.hasPrivileges([
        "service_orders_write_shop_floor",
        "service_orders_write_maintenance",
      ]) &&
        orderRequiresAction(serviceOrder)) ||
        user?.isSuper) && (
        <PageActionButtons>
          {serviceOrder.status === "pending" ? (
            <Button
              icon={<CheckOutlined />}
              onClick={(): void => {
                setAcceptOrderModalIsVisible(true);
              }}
              type="primary"
            >
              Aceitar OS
            </Button>
          ) : serviceOrder.status === "solving" ? (
            <>
              <Button
                onClick={(): void => {
                  setSolutionActionModalType("status");
                }}
              >
                Informar status
              </Button>
              <Button
                icon={<CheckOutlined />}
                onClick={(): void => {
                  setSolutionActionModalType("deliver");
                }}
                type="primary"
              >
                Transmitir solu????o
              </Button>
            </>
          ) : serviceOrder.status === "solved" ? (
            <>
              <Button
                icon={<CheckOutlined />}
                onClick={handleOrderSolutionAccept}
                type="primary"
              >
                Aceitar solu????o
              </Button>
              <Button
                danger={true}
                icon={<CloseOutlined />}
                onClick={(): void => {
                  setRejectSolutionModalIsVisible(true);
                }}
                type="text"
              >
                Rejeitar{breakpoint.lg && " solu????o"}
              </Button>
            </>
          ) : null}
        </PageActionButtons>
      )}

      <Divider />

      <Page scrollTopOffset={24}>
        <Row gutter={[12, 12]}>
          <Col lg={6} xs={12}>
            <DataItem label="Status">
              <ServiceOrderStatusBadge status={serviceOrder.status} />
            </DataItem>
          </Col>

          <Col lg={6} xs={12}>
            <DataItem label="Prioridade/Respons??vel">
              {serviceOrder.priority && serviceOrder.assignedMaintainer ? (
                <Space>
                  <PriorityTag priority={serviceOrder.priority} />
                  <MaintEmployeeTag
                    maintainer={serviceOrder.assignedMaintainer}
                  />
                </Space>
              ) : (
                <em>N??o definidos</em>
              )}
            </DataItem>
          </Col>

          <Col lg={6} xs={12}>
            <DataItem label="Setor">
              <strong>{serviceOrder.dpt.trim().toUpperCase()}</strong>
            </DataItem>
          </Col>

          <Col lg={6} xs={12}>
            <DataItem label="M??quina">
              <ServiceOrderMachineTag
                fallback={serviceOrder.machine.trim().toUpperCase()}
                machine={getOrderMachine(serviceOrder)}
              />
            </DataItem>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[12, 12]}>
          <Col lg={6} xs={8}>
            <DataItem label="Tipo">
              {parseStringId(serviceOrder.maintenanceType)}
            </DataItem>
          </Col>

          <Col lg={6} xs={8}>
            <DataItem label="Equipe">
              {parseStringId(serviceOrder.team)}
            </DataItem>
          </Col>

          <Col lg={6} xs={8}>
            <DataItem label="Causa">
              {parseStringId(serviceOrder.cause)}
            </DataItem>
          </Col>

          <Col lg={6} xs={24}>
            <DataItem label="Parou">
              <Space size="large">
                <div>
                  <strong>Produ????o: </strong>
                  {serviceOrder.interruptions.production ? (
                    <CheckOutlined />
                  ) : (
                    <CloseOutlined />
                  )}
                </div>

                <div>
                  <strong>Linha: </strong>
                  {serviceOrder.interruptions.line ? (
                    <CheckOutlined />
                  ) : (
                    <CloseOutlined />
                  )}
                </div>

                <div>
                  <strong>M??quina: </strong>
                  {serviceOrder.interruptions.equipment ? (
                    <CheckOutlined />
                  ) : (
                    <CloseOutlined />
                  )}
                </div>
              </Space>
            </DataItem>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[12, 12]}>
          <Col lg={12} xs={24}>
            <DataItem label="Informa????es adicionais">
              {serviceOrder.additionalInfo ? (
                <em>{serviceOrder.additionalInfo}</em>
              ) : (
                "???"
              )}
            </DataItem>
          </Col>

          <Col lg={12} xs={24}>
            <DataItem label="Solu????o">
              {serviceOrder.solution ? (
                <strong>{serviceOrder.solution}</strong>
              ) : (
                <em>Nenhuma dispon??vel</em>
              )}
            </DataItem>
          </Col>
        </Row>

        <Divider />

        <Row>
          <Col span={24}>
            <Button
              block={true}
              icon={<HistoryOutlined />}
              onClick={handleTimelineOpen}
            >
              Ver hist??rico
            </Button>
          </Col>
        </Row>
      </Page>

      <MaintServiceOrderTimelineModal
        events={serviceOrder.events}
        isVisible={timelineIsVisible}
        onClose={handleTimelineClose}
      />

      <RejectSolutionModal
        isVisible={rejectSolutionModalIsVisible}
        onClose={(): void => {
          setRejectSolutionModalIsVisible(false);
        }}
        onSubmit={handleOrderSolutionReject}
        serviceOrder={serviceOrder}
      />

      <ConfirmServiceOrderModal
        isVisible={acceptOrderModalIsVisible}
        onClose={(): void => {
          setAcceptOrderModalIsVisible(false);
        }}
        onSubmit={handleOrderConfirm}
        serviceOrder={serviceOrder}
      />

      <ServiceOrderSolutionActionsModal
        isVisible={!!solutionActionModalType}
        onClose={(): void => {
          setSolutionActionModalType(undefined);
        }}
        onSubmit={
          solutionActionModalType === "status"
            ? handleOrderSolutionShareStatus
            : handleOrderDeliver
        }
        serviceOrder={serviceOrder}
        type={solutionActionModalType || "status"}
      />
    </>
  ) : (
    <Result404 backUrl={backUrl} isLoading={loading}>
      A ordem de servi??o requisitada n??o existe ou foi desabilitada.
    </Result404>
  );
}
