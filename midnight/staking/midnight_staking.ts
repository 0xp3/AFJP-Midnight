// midnight_staking.ts

type UserId = string;

interface Stake {
  amount: number;
  lockUntil: number; // timestamp de bloqueo mínimo (epoch ms)
  lastRewardTime: number; // último timestamp cuando se otorgó recompensa
}

class StakingManager {
  private stakes: Map<UserId, Stake> = new Map();
  private totalStaked: number = 0;

  // Constantes configurables
  private minStakeAmount: number = 100; // mínimo para stakear
  private rewardRatePerSecond: number = 0.000001; // recompensa por token y segundo

  constructor() {}

  /**
   * Validar si el usuario puede hacer stake con la cantidad y tiempo indicados
   */
  public validateStake(userId: UserId, amount: number, lockPeriodSeconds: number): boolean {
    if (amount < this.minStakeAmount) {
      return false;
    }
    // Validar período mínimo (por ejemplo, 1 semana)
    const minLockPeriod = 7 * 24 * 3600;
    if (lockPeriodSeconds < minLockPeriod) {
      return false;
    }
    return true;
  }

  /**
   * Registrar o actualizar staking del usuario
   */
  public stake(userId: UserId, amount: number, lockPeriodSeconds: number): void {
    const now = Date.now();

    const lockUntil = now + lockPeriodSeconds * 1000;
    const prevStake = this.stakes.get(userId);

    // Actualizamos estado total del staking
    if (prevStake) {
      this.totalStaked -= prevStake.amount;
    }

    // Guardamos nuevo stake
    this.stakes.set(userId, {
      amount: amount,
      lockUntil: lockUntil,
      lastRewardTime: now,
    });

    this.totalStaked += amount;
  }

  /**
   * Calcular recompensa acumulada desde la última vez que se otorgó
   */
  public calculateReward(userId: UserId): number {
    const now = Date.now();
    const stake = this.stakes.get(userId);
    if (!stake) return 0;

    const elapsed = (now - stake.lastRewardTime) / 1000; // segundos
    const reward = stake.amount * elapsed * this.rewardRatePerSecond;

    // Actualizamos lastRewardTime para no duplicar recompensa
    stake.lastRewardTime = now;
    this.stakes.set(userId, stake);

    return reward;
  }

  /**
   * Ver saldo de staking
   */
  public getStake(userId: UserId): Stake | undefined {
    return this.stakes.get(userId);
  }

  public getTotalStaked(): number {
    return this.totalStaked;
  }
}

export default StakingManager;
