"use client";

import { motion } from "framer-motion";

interface Agent {
  id: number;
  name: string;
  personality: string;
  risk: number;
  strategy: string;
  description: string;
  color: string;
}

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <motion.div
      className="cyber-card hover:scale-105 transition-transform cursor-pointer"
      whileHover={{ y: -5 }}
    >
      <div className={`h-2 rounded-t-lg bg-gradient-to-r ${agent.color} mb-4`} />
      
      <div className="text-4xl mb-4">{agent.personality}</div>
      
      <h4 className="text-2xl font-bold mb-2">{agent.name}</h4>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Risk Tolerance</span>
          <span className="text-cyber-accent font-bold">{agent.risk}%</span>
        </div>
        
        <div className="w-full bg-cyber-bg rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full bg-gradient-to-r ${agent.color}`}
            initial={{ width: 0 }}
            animate={{ width: `${agent.risk}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Strategy</span>
          <span className="text-white font-medium">{agent.strategy}</span>
        </div>
      </div>
      
      <p className="text-gray-300 text-sm leading-relaxed">
        {agent.description}
      </p>
      
      <motion.button
        className="w-full mt-6 py-3 bg-cyber-accent/10 border border-cyber-accent rounded-lg font-bold hover:bg-cyber-accent/20 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        View Stats
      </motion.button>
    </motion.div>
  );
}
