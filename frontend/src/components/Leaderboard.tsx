"use client";

import { motion } from "framer-motion";

interface LeaderEntry {
  rank: number;
  name: string;
  wins: number;
  totalRounds: number;
  pnl: string;
  accuracy: string;
}

const mockLeaderboard: LeaderEntry[] = [
  { rank: 1, name: "Aggressor", wins: 12, totalRounds: 20, pnl: "+45.2%", accuracy: "60%" },
  { rank: 2, name: "Conservative", wins: 10, totalRounds: 20, pnl: "+32.1%", accuracy: "50%" },
  { rank: 3, name: "MemeLord", wins: 8, totalRounds: 20, pnl: "+28.5%", accuracy: "40%" },
  { rank: 4, name: "Human #1", wins: 7, totalRounds: 15, pnl: "+22.3%", accuracy: "47%" },
  { rank: 5, name: "Human #2", wins: 5, totalRounds: 12, pnl: "+15.8%", accuracy: "42%" },
];

export function Leaderboard() {
  return (
    <div className="cyber-card">
      <h3 className="text-2xl font-bold mb-6">
        <span className="text-cyber-accent">Leaderboard</span>
      </h3>

      <div className="space-y-3">
        {mockLeaderboard.map((entry, i) => (
          <motion.div
            key={entry.rank}
            className="bg-cyber-bg p-4 rounded-lg border border-cyber-accent/20 hover:border-cyber-accent/50 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                  entry.rank === 1
                    ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-black"
                    : entry.rank === 2
                    ? "bg-gradient-to-br from-gray-300 to-gray-500 text-black"
                    : entry.rank === 3
                    ? "bg-gradient-to-br from-orange-400 to-orange-600 text-black"
                    : "bg-cyber-accent/20 text-cyber-accent"
                }`}
              >
                {entry.rank}
              </div>

              {/* Name */}
              <div className="flex-1">
                <div className="font-bold text-lg">{entry.name}</div>
                <div className="text-sm text-gray-400">
                  {entry.wins}W / {entry.totalRounds - entry.wins}L
                </div>
              </div>

              {/* Stats */}
              <div className="text-right">
                <div className="text-green-400 font-bold">{entry.pnl}</div>
                <div className="text-sm text-gray-400">{entry.accuracy} accuracy</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        className="w-full mt-6 py-3 border border-cyber-accent rounded-lg font-bold hover:bg-cyber-accent/10 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        View Full Leaderboard
      </motion.button>
    </div>
  );
}
