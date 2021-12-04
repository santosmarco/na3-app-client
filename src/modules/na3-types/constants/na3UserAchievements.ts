import type {
  Na3UserAchievementDefinition,
  Na3UserAchievementId,
} from "../na3";

export const NA3_USER_ACHIEVEMENT_DEFINITIONS: Record<
  Na3UserAchievementId,
  Na3UserAchievementDefinition
> = {
  service_orders_closed: {
    color: "blue",
    title: "OS encerradas",
    description:
      "Encerre ordens de serviço com menos de 4 horas da solução transmitida",
    icon: "check",
    id: "service_orders_closed",
    levels: [
      { goal: 10, score: 1000 },
      { goal: 25, score: 2500 },
      { goal: 100, score: 10000 },
    ],
    targetDepartments: ["shop-floor"],
    levelDescriptor: ({ remainingToNextLevel }) =>
      `Encerre mais ${remainingToNextLevel} orde${
        remainingToNextLevel > 1 ? "ns" : "m"
      } de serviço para alcançar esse nível`,
    validator: (ev) =>
      !!(
        ev.type === "SERVICE_ORDER_ACCEPT_SOLUTION" &&
        ev.data.msFromDeliver &&
        ev.data.msFromDeliver < 4 * 60 * 60 * 1000
      ),
    type: "progressive",
  },
  service_orders_solved: {
    color: "green",
    title: "OS solucionadas",
    description: "Solucione ordens de serviço com menos de 4 horas da abertura",
    icon: "repair",
    id: "service_orders_solved",
    levels: [
      { goal: 10, score: 1000 },
      { goal: 50, score: 2500 },
      { goal: 200, score: 10000 },
      { goal: 500, score: 25000 },
    ],
    targetDepartments: ["manutencao"],
    levelDescriptor: ({ remainingToNextLevel }) =>
      `Solucione mais ${remainingToNextLevel} orde${
        remainingToNextLevel > 1 ? "ns" : "m"
      } de serviço para alcançar esse nível`,
    validator: (ev) =>
      !!(
        ev.type === "SERVICE_ORDER_DELIVER" &&
        ev.data.msFromCreation &&
        ev.data.msFromCreation < 4 * 60 * 60 * 1000
      ),
    type: "progressive",
  },
  user_set_bio: {
    color: "cyan",
    title: "Com a sua cara",
    description: "Defina uma bio para o seu perfil",
    icon: "heart",
    id: "user_set_bio",
    targetDepartments: "all",
    levelDescriptor:
      'Defina sua bio na aba "Minha Conta" para desbloquear essa conquista',
    validator: (ev) => !!(ev.type === "USER_SET_BIO"),
    type: "one-time",
    score: 500,
  },
};
