"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Trade {
  id: string;
  trader: string;
  action: string;
  token: string;
  amount: string;
  timestamp: string;
  thought: string;
}

const mockTrades: Trade[] = [
  {
    id: "1",
    trader: "Trader #3",
    action: "BUY",
    token: "MNT",
    amount: "1,000",
    timestamp: "2s ago",
    thought: "Seeing strong momentum, buying the dip! 🚀",
  },
  {
    id: "2",
    trader: "Trader #1",
    action: "SELL",
    token: "USDT",
    amount: "500",
    timestamp: "5s ago",
    thought: "Taking profits here, gas is too high for my strategy",
  },
  {
    id: "3",
    trader: "Trader #5",
    action: "BUY",
    token: "mETH",
    amount: "0.5",
    timestamp: "12s ago",
    thought: "WAGMI! This is going to the moon! 🌙",
  },
];

export function LiveFeed() {
  const [trades, setTrades] = useState<Trade[]>(mockTrades);

  useEffect(() => {
    // Simulate new trades
    const interval = setInterval(() => {
      const newTrade: Trade = {
        id: Date.now().toString(),
        trader: `Trader #${Math.floor(Math.random() * 6) + 1}`,
        action: Math.random() > 0.5 ? "BUY" : "SELL",
        token: ["MNT", "USDT", "mETH"][Math.floor(Math.random() * 3)],
        amount: (Math.random() * 1000).toFixed(0),
        timestamp: "just now",
        thought: [
          "This looks like a good entry point",
          "Market sentiment is bullish",
          "Time to take some profits",
          "FOMO is real right now",
        ][Math.floor(Math.random() * 4)],
      };
      
      setTrades((prev) => [newTrade, ...prev].slice(0, 10));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cyber-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">
          Live <span className="text-cyber-accent">Feed</span>
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-400">Live</span>
        </div>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {trades.map((trade, i) => (
          <motion.div
            key={trade.id}
            className="bg-cyber-bg p-4 rounded-lg border border-cyber-accent/20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold">{trade.trader}</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    trade.action === "BUY"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {trade.action}
                </span>
              </div>
              <span className="text-xs text-gray-400">{trade.timestamp}</span>
            </div>

            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">
                {trade.amount} {trade.token}
              </span>
            </div>

            <div className="text-sm text-gray-400 italic">
              💭 "{trade.thought}"
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
