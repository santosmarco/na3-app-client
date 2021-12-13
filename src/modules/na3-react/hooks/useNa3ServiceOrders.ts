import type { FirebaseError } from "@modules/firebase-errors-pt-br";
import { translateFirebaseError } from "@modules/firebase-errors-pt-br";
import type {
  Na3Machine,
  Na3MaintenancePerson,
  Na3ServiceOrder,
  Na3ServiceOrderEvent,
  Na3ServiceOrderPriority,
} from "@modules/na3-types";
import dayjs from "dayjs";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useCallback, useRef } from "react";

import type { FirebaseDocOperationResult } from "../types";
import type { ServiceOrderBuilderData } from "../utils";
import {
  buildNa3Error,
  buildServiceOrder,
  buildServiceOrderEvents,
  formatServiceOrderId,
  getCollection,
  timestamp,
} from "../utils";
import { useCurrentUser } from "./useCurrentUser";
import { useNa3Departments } from "./useNa3Departments";
import { useStateSlice } from "./useStateSlice";

export type UseNa3ServiceOrdersResult = {
  data: Na3ServiceOrder[] | null;
  error: FirebaseError | null;
  helpers: {
    acceptSolution: (
      id: string
    ) => Promise<FirebaseDocOperationResult<Na3ServiceOrder>>;
    add: (
      id: string,
      data: ServiceOrderBuilderData
    ) => Promise<FirebaseDocOperationResult<Na3ServiceOrder>>;
    calculateStops: (serviceOrder: Na3ServiceOrder) => {
      loss: number | undefined;
      machine: number;
      production: number;
    };
    confirm: (
      id: string,
      payload: {
        assignee: Na3MaintenancePerson;
        priority: NonNullable<Na3ServiceOrderPriority>;
      }
    ) => Promise<FirebaseDocOperationResult<Na3ServiceOrder>>;
    deliver: (
      id: string,
      payload: { assignee: Na3MaintenancePerson; solution: string }
    ) => Promise<FirebaseDocOperationResult<Na3ServiceOrder>>;
    getById: (id: string) => Na3ServiceOrder | undefined;
    getByStatus: (
      status: Array<Na3ServiceOrder["status"]> | Na3ServiceOrder["status"],
      data?: Na3ServiceOrder[]
    ) => Na3ServiceOrder[];
    getNextId: () => string | undefined;
    getOrderMachine: (serviceOrder: Na3ServiceOrder) => Na3Machine | undefined;
    getUserOrders: (data?: Na3ServiceOrder[]) => Na3ServiceOrder[];
    getWithActionRequired: (data?: Na3ServiceOrder[]) => Na3ServiceOrder[];
    mapByStatus: (
      data?: Na3ServiceOrder[]
    ) => Record<Na3ServiceOrder["status"], Na3ServiceOrder[]>;
    orderRequiresAction: (serviceOrder: Na3ServiceOrder) => boolean;
    rejectSolution: (
      id: string,
      payload: { reason: string }
    ) => Promise<FirebaseDocOperationResult<Na3ServiceOrder>>;
    shareStatus: (
      id: string,
      payload: { assignee: Na3MaintenancePerson; status: string }
    ) => Promise<FirebaseDocOperationResult<Na3ServiceOrder>>;
    sortById: (data?: Na3ServiceOrder[]) => Na3ServiceOrder[];
    sortByPriority: (data?: Na3ServiceOrder[]) => Na3ServiceOrder[];
    sortByStatus: (
      sortingOrder: Array<Na3ServiceOrder["status"]>,
      data?: Na3ServiceOrder[]
    ) => Na3ServiceOrder[];
  };
  loading: boolean;
};

export function useNa3ServiceOrders(): UseNa3ServiceOrdersResult {
  const { environment } = useStateSlice("config");
  const { device } = useStateSlice("global");
  const serviceOrders = useStateSlice("serviceOrders");

  const user = useCurrentUser();
  const departments = useNa3Departments();

  const fbCollectionRef = useRef(getCollection("tickets", environment));

  const getNextId = useCallback((): string | undefined => {
    const lastId = serviceOrders.data
      ?.map((so) => parseInt(so.id))
      .sort((a, b) => a - b)
      .pop();
    return lastId ? formatServiceOrderId(lastId + 1) : undefined;
  }, [serviceOrders.data]);

  const getUserOrders = useCallback(
    (data?: Na3ServiceOrder[]): Na3ServiceOrder[] => {
      const dataConsidered = [...(data || serviceOrders.data || [])];

      if (!user) {
        return [];
      } else if (user.hasPrivileges("service_orders_read_all")) {
        return dataConsidered;
      } else if (user.hasPrivileges("service_orders_read_own")) {
        return dataConsidered.filter((so) =>
          user.includesDepartments(so.username)
        );
      }
      return [];
    },
    [user, serviceOrders.data]
  );

  const getById = useCallback(
    (id: number | string) => {
      return serviceOrders.data?.find((order) => +order.id === +id);
    },
    [serviceOrders.data]
  );

  const getByStatus = useCallback(
    (
      status: Array<Na3ServiceOrder["status"]> | Na3ServiceOrder["status"],
      data?: Na3ServiceOrder[]
    ): Na3ServiceOrder[] => {
      const statusArr = typeof status === "string" ? [status] : status;
      return (data || serviceOrders.data || []).filter((so) =>
        statusArr.includes(so.status)
      );
    },
    [serviceOrders.data]
  );

  const getOrderMachine = useCallback(
    (serviceOrder: Na3ServiceOrder) => {
      return departments.helpers.getById(serviceOrder.username)?.machines?.[
        serviceOrder.machine
      ];
    },
    [departments.helpers]
  );

  const mapByStatus = useCallback(
    (
      data?: Na3ServiceOrder[]
    ): Record<Na3ServiceOrder["status"], Na3ServiceOrder[]> => {
      return {
        closed: getByStatus("closed", data),
        pending: getByStatus("pending", data),
        refused: getByStatus("refused", data),
        solved: getByStatus("solved", data),
        solving: getByStatus("solving", data),
      };
    },
    [getByStatus]
  );

  const sortById = useCallback(
    (data?: Na3ServiceOrder[]) => {
      return [...(data || serviceOrders.data || [])].sort(
        (a, b) => +a.id - +b.id
      );
    },
    [serviceOrders.data]
  );

  const sortByStatus = useCallback(
    (
      sortingOrder: Array<Na3ServiceOrder["status"]>,
      data?: Na3ServiceOrder[]
    ): Na3ServiceOrder[] => {
      const statusMap = mapByStatus(data);
      return sortingOrder.flatMap((status) => [...sortById(statusMap[status])]);
    },
    [mapByStatus, sortById]
  );

  const sortByPriority = useCallback(
    (data?: Na3ServiceOrder[]) => {
      const priorityMap: Record<
        NonNullable<Na3ServiceOrderPriority>,
        number
      > = {
        high: 3,
        low: 1,
        medium: 2,
      };

      return [...(data || serviceOrders.data || [])].sort(
        (a, b) =>
          priorityMap[b.priority || "low"] - priorityMap[a.priority || "low"]
      );
    },
    [serviceOrders.data]
  );

  const orderRequiresAction = useCallback(
    (order: Na3ServiceOrder): boolean => {
      if (!user) return false;

      if (user.hasPrivileges("service_orders_write_shop_floor")) {
        return (
          user.includesDepartments(order.username) && order.status === "solved"
        );
      } else if (user.hasPrivileges("service_orders_write_maintenance")) {
        return order.status === "pending" || order.status === "solving";
      } else {
        return false;
      }
    },
    [user]
  );

  const getWithActionRequired = useCallback(
    (data?: Na3ServiceOrder[]): Na3ServiceOrder[] => {
      return (data || serviceOrders.data)?.filter(orderRequiresAction) || [];
    },
    [serviceOrders.data, orderRequiresAction]
  );

  const addServiceOrder = useCallback(
    async (
      id: string,
      data: ServiceOrderBuilderData
    ): Promise<FirebaseDocOperationResult<Na3ServiceOrder>> => {
      if (!user) {
        return {
          data: null,
          error: buildNa3Error("na3/firestore/generic/user-not-found"),
        };
      }

      const serviceOrder = buildServiceOrder(id, data, { device, user });

      try {
        const docRef = doc(fbCollectionRef.current, id);

        await setDoc(docRef, serviceOrder);

        void user.registerEvents({ SERVICE_ORDER_CREATE: { id } });

        return { data: docRef, error: null };
      } catch (err) {
        return {
          data: null,
          error: translateFirebaseError(err as FirebaseError),
        };
      }
    },
    [device, user]
  );

  const acceptSolution = useCallback(
    async (
      id: string
    ): Promise<FirebaseDocOperationResult<Na3ServiceOrder>> => {
      if (!user) {
        return {
          data: null,
          error: buildNa3Error("na3/firestore/generic/user-not-found"),
        };
      }

      const docRef = doc(fbCollectionRef.current, id);

      try {
        const update: Required<Pick<Na3ServiceOrder, "closedAt" | "status">> = {
          closedAt: timestamp(),
          status: "closed",
        };

        await updateDoc(docRef, {
          ...update,
          events: arrayUnion(
            ...buildServiceOrderEvents(
              [
                { type: "solutionAccepted" },
                { type: "ticketClosed" },
                {
                  payload: { solutionStep: { type: "solutionAccepted" } },
                  type: "solutionStepAdded",
                },
              ],
              { device, user }
            )
          ),
        });

        void getDoc(docRef).then((serviceOrderSnapshot) => {
          const serviceOrder = serviceOrderSnapshot.data();

          if (!serviceOrder) {
            // TODO: Handle doc not found error
            return;
          }

          const lastDeliverEvent = [...serviceOrder.events]
            .reverse()
            .find((ev) => ev.type === "solutionTransmitted");

          void user.registerEvents({
            SERVICE_ORDER_ACCEPT_SOLUTION: {
              id,
              msFromDeliver: lastDeliverEvent
                ? dayjs(lastDeliverEvent.timestamp).diff(dayjs())
                : null,
            },
          });
        });

        return { data: docRef, error: null };
      } catch (err) {
        return {
          data: null,
          error: translateFirebaseError(err as FirebaseError),
        };
      }
    },
    [device, user]
  );

  const rejectSolution = useCallback(
    async (
      id: string,
      payload: { reason: string }
    ): Promise<FirebaseDocOperationResult<Na3ServiceOrder>> => {
      if (!user) {
        return {
          data: null,
          error: buildNa3Error("na3/firestore/generic/user-not-found"),
        };
      }

      try {
        const docRef = doc(fbCollectionRef.current, id);

        await updateDoc(docRef, {
          acceptedAt: null,
          priority: null,
          refusalReason: payload.reason.trim(),
          reopenedAt: timestamp(),
          solution: null,
          solvedAt: null,
          status: "pending",
          events: arrayUnion(
            ...buildServiceOrderEvents(
              [
                {
                  payload: { refusalReason: payload.reason },
                  type: "solutionRefused",
                },
                { type: "ticketReopened" },
                {
                  payload: { solutionStep: { type: "solutionRefused" } },
                  type: "solutionStepAdded",
                },
              ],
              { device, user }
            )
          ),
        });

        void user.registerEvents({
          SERVICE_ORDER_REJECT_SOLUTION: {
            id,
            refusalReason: payload.reason.trim(),
          },
        });

        return { data: docRef, error: null };
      } catch (err) {
        return {
          data: null,
          error: translateFirebaseError(err as FirebaseError),
        };
      }
    },
    [device, user]
  );

  const confirmServiceOrder = useCallback(
    async (
      id: string,
      payload: {
        assignee: Na3MaintenancePerson;
        priority: NonNullable<Na3ServiceOrderPriority>;
      }
    ): Promise<FirebaseDocOperationResult<Na3ServiceOrder>> => {
      if (!user) {
        return {
          data: null,
          error: buildNa3Error("na3/firestore/generic/user-not-found"),
        };
      }

      try {
        const docRef = doc(fbCollectionRef.current, id);

        const sanitizedAssignee = {
          uid: payload.assignee.uid,
          displayName: payload.assignee.displayName,
        };

        await updateDoc(docRef, {
          acceptedAt: timestamp(),
          assignedMaintainer: sanitizedAssignee,
          priority: payload.priority,
          status: "solving",
          events: arrayUnion(
            buildServiceOrderEvents(
              {
                payload: {
                  assignedMaintainer: sanitizedAssignee,
                  priority: payload.priority,
                },
                type: "ticketConfirmed",
              },
              { device, user }
            )
          ),
        });

        void user.registerEvents({
          SERVICE_ORDER_CONFIRM: {
            id,
            assigneeUid: payload.assignee.uid,
            priority: payload.priority,
          },
        });

        return { data: docRef, error: null };
      } catch (err) {
        return {
          data: null,
          error: translateFirebaseError(err as FirebaseError),
        };
      }
    },
    [device, user]
  );

  const shareStatus = useCallback(
    async (
      id: string,
      payload: { assignee: Na3MaintenancePerson; status: string }
    ): Promise<FirebaseDocOperationResult<Na3ServiceOrder>> => {
      if (!user) {
        return {
          data: null,
          error: buildNa3Error("na3/firestore/generic/user-not-found"),
        };
      }

      try {
        const docRef = doc(fbCollectionRef.current, id);

        const sanitizedAssignee = {
          uid: payload.assignee.uid,
          displayName: payload.assignee.displayName,
        };

        await updateDoc(docRef, {
          solutionSteps: arrayUnion(payload.status.trim()),
          events: arrayUnion(
            buildServiceOrderEvents(
              {
                payload: {
                  solutionStep: {
                    content: payload.status.trim(),
                    type: "step",
                    who: sanitizedAssignee,
                  },
                },
                type: "solutionStepAdded",
              },
              { device, user }
            )
          ),
        });

        return { data: docRef, error: null };
      } catch (err) {
        return {
          data: null,
          error: translateFirebaseError(err as FirebaseError),
        };
      }
    },
    [device, user]
  );

  const deliverServiceOrder = useCallback(
    async (
      id: string,
      payload: { assignee: Na3MaintenancePerson; solution: string }
    ): Promise<FirebaseDocOperationResult<Na3ServiceOrder>> => {
      if (!user) {
        return {
          data: null,
          error: buildNa3Error("na3/firestore/generic/user-not-found"),
        };
      }

      const docRef = doc(fbCollectionRef.current, id);

      try {
        const sanitizedAssignee = {
          uid: payload.assignee.uid,
          displayName: payload.assignee.displayName,
        };

        await updateDoc(docRef, {
          solution: payload.solution.trim(),
          solvedAt: timestamp(),
          status: "solved",
          events: arrayUnion(
            ...buildServiceOrderEvents(
              [
                {
                  payload: {
                    solution: {
                      content: payload.solution.trim(),
                      who: sanitizedAssignee,
                    },
                  },
                  type: "solutionTransmitted",
                },
                {
                  payload: {
                    solutionStep: {
                      content: payload.solution.trim(),
                      type: "solutionTransmitted",
                      who: sanitizedAssignee,
                    },
                  },
                  type: "solutionStepAdded",
                },
              ],
              { device, user }
            )
          ),
        });

        void getDoc(docRef).then((serviceOrderSnapshot) => {
          const serviceOrder = serviceOrderSnapshot.data();

          if (!serviceOrder) {
            // TODO: Handle doc not found error
            return;
          }

          const createEvent = serviceOrder.events[0];

          void user.registerEvents({
            SERVICE_ORDER_DELIVER: {
              id,
              msFromCreation: dayjs().diff(dayjs(createEvent.timestamp)),
            },
          });
        });

        return { data: docRef, error: null };
      } catch (err) {
        return {
          data: null,
          error: translateFirebaseError(err as FirebaseError),
        };
      }
    },
    [device, user]
  );

  const getMsBetweenEvents = useCallback(
    (
      laterEvent: Na3ServiceOrderEvent | undefined,
      earlierEvent: Na3ServiceOrderEvent | undefined
    ): number => {
      if (!laterEvent || !earlierEvent) return 0;
      return dayjs(laterEvent.timestamp).diff(dayjs(earlierEvent.timestamp));
    },
    []
  );

  const calcMachineStoppedMs = useCallback(
    (serviceOrder: Na3ServiceOrder): number => {
      if (!serviceOrder.interruptions.equipment) {
        return 0;
      }

      const deliverEvents = serviceOrder.events.filter(
        (ev) => ev.type === "solutionTransmitted"
      );

      let totalMs = 0;

      if (deliverEvents.length === 0) {
        totalMs = dayjs().diff(dayjs(serviceOrder.createdAt));
      } else {
        const creationEvents = serviceOrder.events.filter(
          (ev) => ev.type === "ticketCreated"
        );
        const reopenEvents = serviceOrder.events.filter(
          (ev) => ev.type === "ticketReopened"
        );

        totalMs = deliverEvents.reduce(
          (acc, deliverEv, idx) =>
            acc +
            getMsBetweenEvents(
              deliverEv,
              [...creationEvents, ...reopenEvents][idx]
            ),
          0
        );

        totalMs += reopenEvents.reduce(
          (acc, reopenEv, idx) =>
            acc + getMsBetweenEvents(reopenEv, deliverEvents[idx]),
          0
        );
      }

      if (serviceOrder.interruptions.line) {
        // Multiply by number of machines in line
      }

      return totalMs;
    },
    [getMsBetweenEvents]
  );

  const calcProdStoppedMs = useCallback(
    (serviceOrder: Na3ServiceOrder): number => {
      if (
        !serviceOrder.interruptions.production ||
        serviceOrder.maintenanceType === "preventiva"
      ) {
        return 0;
      }

      return calcMachineStoppedMs(serviceOrder);
    },
    [calcMachineStoppedMs]
  );

  const calcLoss = useCallback(
    (serviceOrder: Na3ServiceOrder): number | undefined => {
      const serviceOrderMachine = departments.helpers.getDepartmentMachineById(
        serviceOrder.username,
        serviceOrder.machine
      );

      if (!serviceOrderMachine || !serviceOrderMachine.hourlyProdRate) {
        return;
      }
      return (
        serviceOrderMachine.hourlyProdRate *
        dayjs.duration(calcProdStoppedMs(serviceOrder)).asHours()
      );
    },
    [departments.helpers, calcProdStoppedMs]
  );

  const calculateStops = useCallback(
    (serviceOrder: Na3ServiceOrder) => {
      return {
        machine: calcMachineStoppedMs(serviceOrder),
        production: calcProdStoppedMs(serviceOrder),
        loss: calcLoss(serviceOrder),
      };
    },
    [calcMachineStoppedMs, calcProdStoppedMs, calcLoss]
  );

  return {
    ...serviceOrders,
    helpers: {
      acceptSolution,
      add: addServiceOrder,
      confirm: confirmServiceOrder,
      deliver: deliverServiceOrder,
      getById,
      getByStatus,
      getNextId,
      getOrderMachine,
      getUserOrders,
      getWithActionRequired,
      mapByStatus,
      orderRequiresAction,
      rejectSolution,
      shareStatus,
      sortById,
      sortByPriority,
      sortByStatus,
      calculateStops,
    },
  };
}
