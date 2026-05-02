import { provider } from '../config/contracts.js';

export class MarketDataService {
  constructor() {
    this.cache = {
      mntPrice: 0.65,
      gasPrice: 0,
      volume24h: 1250000,
      volatility: 2.5
    };
  }

  /**
   * Get current market data
   */
  async getMarketData() {
    try {
      // Get real gas price from Mantle
      const feeData = await provider.getFeeData();
      const gasPriceGwei = Number(feeData.gasPrice) / 1e9;

      // Update cache
      this.cache.gasPrice = gasPriceGwei.toFixed(2);

      // Simulate price fluctuation (in production, fetch from DEX)
      this.cache.mntPrice = (0.65 + (Math.random() - 0.5) * 0.05).toFixed(4);
      
      // Simulate volume fluctuation
      this.cache.volume24h = (1250000 + (Math.random() - 0.5) * 100000).toFixed(0);
      
      // Simulate volatility
      this.cache.volatility = (2.5 + (Math.random() - 0.5) * 1).toFixed(2);

      return { ...this.cache };
    } catch (error) {
      console.error('Error fetching market data:', error.message);
      return { ...this.cache };
    }
  }

  /**
   * Determine market scenario
   */
  getScenario(marketData) {
    const gasPrice = parseFloat(marketData.gasPrice);
    const volatility = parseFloat(marketData.volatility);
    const volume = parseFloat(marketData.volume24h);

    if (gasPrice > 150) {
      return {
        type: 'HIGH_GAS',
        description: 'Gas price is very high',
        favoredAgent: 'Conservative'
      };
    }

    if (volatility > 3) {
      return {
        type: 'VOLATILE',
        description: 'Market is highly volatile',
        favoredAgent: 'Aggressor'
      };
    }

    if (volume < 1000000) {
      return {
        type: 'STABLE',
        description: 'Low volume, stable market',
        favoredAgent: 'Arbitrageur'
      };
    }

    return {
      type: 'NORMAL',
      description: 'Normal market conditions',
      favoredAgent: null
    };
  }

  /**
   * Calculate execution score
   */
  calculateScore(agent, marketData) {
    const scenario = this.getScenario(marketData);
    const pnl = agent.balance - 1000;
    const pnlPercent = pnl / 1000;

    // Sharpe ratio (simplified)
    const sharpe = agent.trades.length > 0 ? pnlPercent / Math.sqrt(agent.trades.length) : 0;

    // Gas efficiency
    const avgGas = agent.trades.reduce((sum, t) => sum + parseFloat(t.gasUsed), 0) / agent.trades.length || 0;
    const gasEfficiency = avgGas > 0 ? 1 - (avgGas / 200) : 1;

    // Base score
    let score = pnlPercent * 100 * sharpe * gasEfficiency;

    // Bonus if agent matches scenario
    if (scenario.favoredAgent === agent.name) {
      score *= 1.5;
    }

    return Math.round(score * 100) / 100;
  }
}
