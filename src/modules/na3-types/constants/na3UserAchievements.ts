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
    description: "Encerre ordens de serviço",
    icon: "repair-user",
    id: "service_orders_closed",
    levels: [
      { goal: 10, score: 1000 },
      { goal: 25, score: 2500 },
      { goal: 100, score: 10000 },
    ],
    targetDepartments:
      process.env.NODE_ENV === "production" ? ["shop-floor"] : "all",
    levelDescriptor: ({ currentLevel, levels, totalProgress }, lvlIdx) => {
      const remainingToLevel = levels[lvlIdx].goal - totalProgress;
      return currentLevel.idx > lvlIdx
        ? "Concluído!"
        : `Encerre mais ${remainingToLevel} orde${
            currentLevel.remainingToNextLevel > 1 ? "ns" : "m"
          } de serviço para alcançar esse nível`;
    },
    validator: (ev) => ev.type === "SERVICE_ORDER_ACCEPT_SOLUTION",
    type: "progressive",
  },
  service_orders_solved: {
    color: "green",
    title: "OS solucionadas",
    description: "Solucione ordens de serviço",
    icon: "repair",
    id: "service_orders_solved",
    levels: [
      { goal: 10, score: 1000 },
      { goal: 50, score: 2500 },
      { goal: 200, score: 10000 },
      { goal: 500, score: 25000 },
    ],
    targetDepartments:
      process.env.NODE_ENV === "production" ? ["manutencao"] : "all",
    levelDescriptor: ({ currentLevel, levels, totalProgress }, lvlIdx) => {
      const remainingToLevel = levels[lvlIdx].goal - totalProgress;
      return currentLevel.idx > lvlIdx
        ? "Concluído!"
        : `Solucione mais ${remainingToLevel} orde${
            currentLevel.remainingToNextLevel > 1 ? "ns" : "m"
          } de serviço para alcançar esse nível`;
    },
    validator: (ev) => ev.type === "SERVICE_ORDER_DELIVER",
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
    validator: (ev) => ev.type === "USER_SET_BIO",
    type: "one-time",
    totalScore: 500,
  },
};
