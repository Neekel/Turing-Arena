"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface Trade {
  id: string; trader: string; action: string; token: string;
  amount: string; timestamp: string; thought: string;
}

const mockTrades: Trade[] = [
  { id: "1", trader: "Trader #3", action: "BUY", token: "MNT", amount: "1,000", timestamp: "2s ago", thought: "Seeing strong momentum, buying the dip! 🚀" },
  { id: "2", trader: "Trader #1", action: "SELL", token: "USDT", amount: "500", timestamp: "5s ago", thought: "Taking profits here, gas is too high for my strategy" },
  { id: "3", trader: "Trader #5", action: "BUY", token: "mETH", amount: "0.5", timestamp: "12s ago", thought: "WAGMI! This is going to the moon! 🌙" },
];

export function LiveFeed() {
  const [trades, setTrades] = useState<Trade[]>(mockTrades);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTrade: Trade = {
        id: Date.now().toString(),
        trader: `Trader #${Math.floor(Math.random() * 6) + 1}`,
        action: Math.random() > 0.5 ? "BUY" : "SELL",
        token: ["MNT", "USDT", "mETH"][Math.floor(Math.random() * 3)],
        amount: (Math.random() * 1000).toFixed(0),
        timestamp: "just now",
        thought: ["This looks like a good entry point", "Market sentiment is bullish", "Time to take some profits", "FOMO is real right now"][Math.floor(Math.random() * 4)],
      };
      setTrades(prev => [newTrade, ...prev].slice(0, 10));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#1a1f3a] border border-[#00f0ff]/20 rounded-sm p-5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#00f0ff]/10">
        <h3 className="text-lg font-mono font-bold text-white uppercase tracking-wider">Live Feed</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs font-mono text-green-400">LIVE</span>
        </div>
      </div>

      <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
        <AnimatePresence>
          {trades.map((trade, i) => (
            <motion.div key={trade.id}
              className="bg-[#0a0e27] border border-[#00f0ff]/10 rounded-sm p-3 hover:border-[#00f0ff]/30 transition-colors"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }} transition={{ delay: i * 0.03 }}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-white">{trade.trader}</span>
                  <span className={`px-2 py-0.5 rounded-sm text-xs font-mono font-bold ${trade.action === "BUY" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {trade.action}
                  </span>
                  <span className="text-sm font-mono text-[#00f0ff]">{trade.amount} {trade.token}</span>
                </div>
                <span className="text-xs font-mono text-gray-500">{trade.timestamp}</span>
              </div>
              <div className="text-xs font-mono text-gray-400 italic">"{trade.thought}"</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
