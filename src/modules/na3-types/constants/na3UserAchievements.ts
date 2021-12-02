import type { Na3UserAchievement, Na3UserAchievementId } from "../na3";

export const NA3_USER_ACHIEVEMENTS: {
  [Id in Na3UserAchievementId]: Na3UserAchievement<Id>;
} = {
  service_orders_closed: {
    color: "blue",
    title: "OS encerradas",
    description:
      "Encerre ordens de serviço com menos de 4 horas da solução transmitida",
    icon: "gi-check-mark",
    id: "service_orders_closed",
    levels: [
      { goal: 10, score: 1000 },
      { goal: 25, score: 2500 },
      { goal: 100, score: 10000 },
    ],
    targetDepartments: ["shop-floor"],
    levelDescriptor:
      "Encerre mais {{remaining}} ordens de serviço para alcançar este nível",
    validate: (ev) =>
      !!(
        ev.type === "SERVICE_ORDER_ACCEPT_SOLUTION" &&
        ev.data.msFromDeliver &&
        ev.data.msFromDeliver < 4 * 60 * 60 * 1000
      ),
  },
  service_orders_solved: {
    color: "green",
    title: "OS solucionadas",
    description: "Solucione ordens de serviço com menos de 4 horas da abertura",
    icon: "gi-auto-repair",
    id: "service_orders_solved",
    levels: [
      { goal: 10, score: 1000 },
      { goal: 50, score: 2500 },
      { goal: 200, score: 10000 },
      { goal: 500, score: 25000 },
    ],
    targetDepartments: ["manutencao"],
    levelDescriptor:
      "Solucione mais {{remaining}} ordens de serviço para alcançar este nível",
    validate: (ev) =>
      !!(
        ev.type === "SERVICE_ORDER_DELIVER" &&
        ev.data.msFromCreation &&
        ev.data.msFromCreation < 4 * 60 * 60 * 1000
      ),
  },
};
