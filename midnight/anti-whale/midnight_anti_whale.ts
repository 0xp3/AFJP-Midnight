// midnight_anti_whale.ts

type UserId = string;

interface StakeRecord {
  amount: number;
  // Otros campos relevantes
}

interface WhalePenaltyResult {
  penaltyAmount: number;
  distributedAmounts: Record<UserId, number>;
}

class AntiWhaleManager {
  // Umbral máximo (en porcentaje del total staked) permisible sin penalización
  private whaleThresholdPercent: number;
}
