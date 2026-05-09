"use client";
import { motion } from "framer-motion";

interface Agent {
  id: number; name: string; personality: string; risk: number;
  strategy: string; description: string; color: string;
}

const riskColor = (risk: number) =>
  risk >= 70 ? "#ff006e" : risk >= 40 ? "#f59e0b" : "#00f0ff";

export function AgentCard({ agent }: { agent: Agent }) {
  const color = riskColor(agent.risk);
  return (
    <motion.div
      className="bg-[#1a1f3a] border rounded-sm p-5 cursor-pointer relative overflow-hidden group"
      style={{ borderColor: `${color}30` }}
      whileHover={{ borderColor: color, boxShadow: `0 0 20px ${color}30` }}
      transition={{ duration: 0.2 }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

      {/* Personality icon — BIG */}
      <div className="text-5xl mb-4">{agent.personality.split(" ")[0]}</div>

      {/* Name */}
      <h4 className="text-2xl font-bold mb-1 font-mono">{agent.name}</h4>
      <div className="text-sm font-mono mb-4" style={{ color }}>{agent.strategy}</div>

      {/* Risk meter */}
      <div className="mb-4">
        <div className="flex justify-between text-xs font-mono mb-1">
          <span className="text-gray-400 uppercase">Risk Level</span>
          <span className="font-bold" style={{ color }}>{agent.risk}%</span>
        </div>
        <div className="h-2 bg-[#0a0e27] rounded-sm overflow-hidden">
          <motion.div className="h-full rounded-sm" style={{ background: color }}
            initial={{ width: 0 }} animate={{ width: `${agent.risk}%` }}
            transition={{ duration: 1, delay: 0.3 }} />
        </div>
      </div>

      <p className="text-gray-400 text-sm leading-relaxed mb-5">{agent.description}</p>

      <button className="w-full py-2.5 rounded-sm font-mono font-bold text-sm transition-all border"
        style={{ borderColor: color, color, background: `${color}10` }}
        onMouseEnter={e => (e.currentTarget.style.background = `${color}20`)}
        onMouseLeave={e => (e.currentTarget.style.background = `${color}10`)}>
        View Stats →
      </button>
    </motion.div>
  );
}
