import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export class BaseAgent {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.personality = config.personality;
    this.riskTolerance = config.riskTolerance;
    this.strategy = config.strategy;
    this.systemPrompt = config.systemPrompt;
    this.balance = 1000; // Starting balance in testnet MNT
    this.trades = [];
  }

  /**
   * Generate trading decision using Groq LLM
   */
  async makeDecision(marketData) {
    const prompt = this.buildPrompt(marketData);

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: prompt }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: this.riskTolerance / 100,
        max_tokens: 500,
      });

      const response = completion.choices[0]?.message?.content || '';
      return this.parseDecision(response);
    } catch (error) {
      console.error(`[${this.name}] Error making decision:`, error.message);
      return { action: 'HOLD', reasoning: 'Error occurred' };
    }
  }

  /**
   * Build prompt based on market data
   */
  buildPrompt(marketData) {
    return `
Current Market Situation:
- MNT Price: $${marketData.mntPrice}
- Gas Price: ${marketData.gasPrice} gwei
- Volume (24h): $${marketData.volume24h}
- Volatility: ${marketData.volatility}%
- Your Balance: ${this.balance} MNT

Based on your ${this.strategy} strategy and ${this.riskTolerance}% risk tolerance, 
should you BUY, SELL, or HOLD? 

Respond in JSON format:
{
  "action": "BUY|SELL|HOLD",
  "amount": <number>,
  "reasoning": "<your thought process>",
  "confidence": <0-100>
}
`;
  }

  /**
   * Parse LLM response into structured decision
   */
  parseDecision(response) {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const decision = JSON.parse(jsonMatch[0]);
        return {
          action: decision.action || 'HOLD',
          amount: decision.amount || 0,
          reasoning: decision.reasoning || 'No reasoning provided',
          confidence: decision.confidence || 50
        };
      }
    } catch (error) {
      console.error(`[${this.name}] Error parsing decision:`, error.message);
    }

    // Fallback
    return {
      action: 'HOLD',
      amount: 0,
      reasoning: response.substring(0, 200),
      confidence: 50
    };
  }

  /**
   * Execute trade (simplified for demo)
   */
  async executeTrade(decision, marketData) {
    if (decision.action === 'HOLD') {
      return null;
    }

    const trade = {
      id: Date.now().toString(),
      traderId: this.id,
      traderName: this.name,
      action: decision.action,
      token: 'MNT',
      amount: decision.amount,
      price: marketData.mntPrice,
      gasUsed: marketData.gasPrice,
      reasoning: decision.reasoning,
      confidence: decision.confidence,
      timestamp: new Date().toISOString()
    };

    // Update balance (simplified)
    if (decision.action === 'BUY') {
      this.balance -= decision.amount;
    } else if (decision.action === 'SELL') {
      this.balance += decision.amount;
    }

    this.trades.push(trade);
    return trade;
  }

  /**
   * Get agent stats
   */
  getStats() {
    const totalTrades = this.trades.length;
    const pnl = this.balance - 1000; // Starting balance was 1000
    const pnlPercent = ((pnl / 1000) * 100).toFixed(2);

    return {
      id: this.id,
      name: this.name,
      personality: this.personality,
      balance: this.balance.toFixed(2),
      totalTrades,
      pnl: pnlPercent,
      recentTrades: this.trades.slice(-5)
    };
  }
}
