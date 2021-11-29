import firebase from "firebase";
import { useCallback, useRef } from "react";

import type { FirebaseError } from "../../firebase-errors-pt-br";
import type { Na3Machine, Na3ServiceOrder } from "../../na3-types";
import type { FirebaseOperationResult } from "../types";
import type { ServiceOrderBuilderData } from "../utils";
import {
  buildServiceOrder,
  buildServiceOrderEvents,
  formatServiceOrderId,
  resolveCollectionId,
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
    ) => Promise<FirebaseOperationResult<Na3ServiceOrder>>;
    add: (
      id: string,
      data: ServiceOrderBuilderData
    ) => Promise<FirebaseOperationResult<Na3ServiceOrder>>;
    confirm: (
      id: string,
      payload: {
        assignee: string;
        priority: NonNullable<Na3ServiceOrder["priority"]>;
      }
    ) => Promise<FirebaseOperationResult<Na3ServiceOrder>>;
    deliver: (
      id: string,
      payload: { assignee: string; solution: string }
    ) => Promise<FirebaseOperationResult<Na3ServiceOrder>>;
    getById: (id: string) => Na3ServiceOrder | undefined;
    getByStatus: (
      status: Na3ServiceOrder["status"] | Na3ServiceOrder["status"][],
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
    ) => Promise<FirebaseOperationResult<Na3ServiceOrder>>;
    shareStatus: (
      id: string,
      payload: { assignee: string; status: string }
    ) => Promise<FirebaseOperationResult<Na3ServiceOrder>>;
    sortById: (data?: Na3ServiceOrder[]) => Na3ServiceOrder[];
    sortByPriority: (data?: Na3ServiceOrder[]) => Na3ServiceOrder[];
    sortByStatus: (
      sortingOrder: Na3ServiceOrder["status"][],
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

  const fbCollectionRef = useRef(
    firebase.firestore().collection(resolveCollectionId("tickets", environment))
  );

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
      status: Na3ServiceOrder["status"] | Na3ServiceOrder["status"][],
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
      sortingOrder: Na3ServiceOrder["status"][],
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
        NonNullable<Na3ServiceOrder["priority"]>,
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
    ): Promise<FirebaseOperationResult<Na3ServiceOrder>> => {
      const serviceOrder = buildServiceOrder(id, data, device);

      try {
        const docRef = fbCollectionRef.current.doc(
          id
        ) as firebase.firestore.DocumentReference<Na3ServiceOrder>;

        await docRef.set(serviceOrder);

        return { data: docRef, error: null };
      } catch (error) {
        return { data: null, error: error as FirebaseError };
      }
    },
    [device]
  );

  const acceptSolution = useCallback(
    async (id: string): Promise<FirebaseOperationResult<Na3ServiceOrder>> => {
      try {
        const docRef = fbCollectionRef.current.doc(
          id
        ) as firebase.firestore.DocumentReference<Na3ServiceOrder>;

        const update: Required<Pick<Na3ServiceOrder, "closedAt" | "status">> = {
          closedAt: timestamp(),
          status: "closed",
        };

        await docRef.update({
          ...update,
          events: firebase.firestore.FieldValue.arrayUnion(
            ...buildServiceOrderEvents(
              [
                { type: "solutionAccepted" },
                { type: "ticketClosed" },
                {
                  payload: { solutionStep: { type: "solutionAccepted" } },
                  type: "solutionStepAdded",
                },
              ],
              device
            )
          ),
        });

        return { data: docRef, error: null };
      } catch (error) {
        return { data: null, error: error as FirebaseError };
      }
    },
    [device]
  );

  const rejectSolution = useCallback(
    async (
      id: string,
      payload: { reason: string }
    ): Promise<FirebaseOperationResult<Na3ServiceOrder>> => {
      try {
        const docRef = fbCollectionRef.current.doc(
          id
        ) as firebase.firestore.DocumentReference<Na3ServiceOrder>;

        const update: Required<
          Pick<
            Na3ServiceOrder,
            | "acceptedAt"
            | "priority"
            | "refusalReason"
            | "reopenedAt"
            | "solution"
            | "solvedAt"
            | "status"
          >
        > = {
          acceptedAt: null,
          priority: null,
          refusalReason: payload.reason.trim(),
          reopenedAt: timestamp(),
          solution: null,
          solvedAt: null,
          status: "pending",
        };

        await docRef.update({
          ...update,
          events: firebase.firestore.FieldValue.arrayUnion(
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
              device
            )
          ),
        });

        return { data: docRef, error: null };
      } catch (error) {
        return { data: null, error: error as FirebaseError };
      }
    },
    [device]
  );

  const confirmServiceOrder = useCallback(
    async (
      id: string,
      payload: {
        assignee: string;
        priority: NonNullable<Na3ServiceOrder["priority"]>;
      }
    ): Promise<FirebaseOperationResult<Na3ServiceOrder>> => {
      try {
        const docRef = fbCollectionRef.current.doc(
          id
        ) as firebase.firestore.DocumentReference<Na3ServiceOrder>;

        const update: Required<
          Pick<
            Na3ServiceOrder,
            "acceptedAt" | "assignedMaintainer" | "priority" | "status"
          >
        > = {
          acceptedAt: timestamp(),
          assignedMaintainer: payload.assignee.trim(),
          priority: payload.priority,
          status: "solving",
        };

        await docRef.update({
          ...update,
          events: firebase.firestore.FieldValue.arrayUnion(
            buildServiceOrderEvents(
              {
                payload: {
                  assignedMaintainer: payload.assignee.trim(),
                  priority: payload.priority,
                },
                type: "ticketConfirmed",
              },
              device
            )
          ),
        });

        return { data: docRef, error: null };
      } catch (error) {
        return { data: null, error: error as FirebaseError };
      }
    },
    [device]
  );

  const shareStatus = useCallback(
    async (
      id: string,
      payload: { assignee: string; status: string }
    ): Promise<FirebaseOperationResult<Na3ServiceOrder>> => {
      try {
        const docRef = fbCollectionRef.current.doc(
          id
        ) as firebase.firestore.DocumentReference<Na3ServiceOrder>;

        const update: Required<
          Record<
            keyof Pick<Na3ServiceOrder, "solutionSteps">,
            firebase.firestore.FieldValue
          >
        > = {
          solutionSteps: firebase.firestore.FieldValue.arrayUnion(
            payload.status.trim()
          ),
        };

        await docRef.update({
          ...update,
          events: firebase.firestore.FieldValue.arrayUnion(
            buildServiceOrderEvents(
              {
                payload: {
                  solutionStep: {
                    content: payload.status.trim(),
                    type: "step",
                    who: payload.assignee.trim(),
                  },
                },
                type: "solutionStepAdded",
              },
              device
            )
          ),
        });

        return { data: docRef, error: null };
      } catch (error) {
        return { data: null, error: error as FirebaseError };
      }
    },
    [device]
  );

  const deliverServiceOrder = useCallback(
    async (
      id: string,
      payload: { assignee: string; solution: string }
    ): Promise<FirebaseOperationResult<Na3ServiceOrder>> => {
      try {
        const docRef = fbCollectionRef.current.doc(
          id
        ) as firebase.firestore.DocumentReference<Na3ServiceOrder>;

        const update: Required<
          Pick<Na3ServiceOrder, "solution" | "solvedAt" | "status">
        > = {
          solution: payload.solution.trim(),
          solvedAt: timestamp(),
          status: "solved",
        };

        await docRef.update({
          ...update,
          events: firebase.firestore.FieldValue.arrayUnion(
            ...buildServiceOrderEvents(
              [
                {
                  payload: {
                    solution: {
                      content: payload.solution.trim(),
                      who: payload.assignee.trim(),
                    },
                  },
                  type: "solutionTransmitted",
                },
                {
                  payload: {
                    solutionStep: {
                      content: payload.solution.trim(),
                      type: "solutionTransmitted",
                      who: payload.assignee.trim(),
                    },
                  },
                  type: "solutionStepAdded",
                },
              ],
              device
            )
          ),
        });

        return { data: docRef, error: null };
      } catch (error) {
        return { data: null, error: error as FirebaseError };
      }
    },
    [device]
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
    },
  };
}
