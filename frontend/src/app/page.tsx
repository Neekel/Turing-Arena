"use client";

import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { AgentCard } from "@/components/AgentCard";
import { LiveFeed } from "@/components/LiveFeed";
import { Leaderboard } from "@/components/Leaderboard";
import { VotingPanel } from "@/components/VotingPanel";
import { RevealAnimation } from "@/components/RevealAnimation";
import { AddMantleNetwork } from "@/components/AddMantleNetwork";
import { ToastContainer } from "@/components/Toast";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useToast } from "@/hooks/useToast";
import { useAccount } from "wagmi";

const agents = [
  {
    id: 0,
    name: "Aggressor",
    personality: "🦁 Aggressor",
    risk: 80,
    strategy: "Momentum Trading",
    description: "Catches pumps, high leverage, fast decisions",
    color: "from-red-500 to-orange-500",
  },
  {
    id: 1,
    name: "Conservative",
    personality: "🦉 Conservative",
    risk: 20,
    strategy: "Dollar-Cost Averaging",
    description: "Patient, explains every move, hard to distinguish from cautious human",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    name: "MemeLord",
    personality: "🎭 MemeLord",
    risk: 90,
    strategy: "Sentiment-Driven",
    description: "Trades on hype, uses slang, most unpredictable",
    color: "from-purple-500 to-pink-500",
  },
];

export default function Home() {
  const [trades, setTrades] = useState<any[]>([]);
  const [showVoting, setShowVoting] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [revealResults, setRevealResults] = useState<any[]>([]);
  const [currentRoundId, setCurrentRoundId] = useState<number | null>(null);

  const { isConnected, lastMessage } = useWebSocket("ws://localhost:4000");
  const { chain } = useAccount();
  const { toasts, removeToast, success, error, warning, info } = useToast();
  
  const isWrongNetwork = chain && chain.id !== 5003;

  // Check for active round on mount
  useEffect(() => {
    const checkActiveRound = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/rounds/active/current");
        const data = await response.json();
        if (data.round) {
          console.log("Active round found:", data.round);
          setCurrentRoundId(data.round.id);
          setTrades(data.round.trades || []);
          setShowVoting(true);
        }
      } catch (error) {
        console.error("Failed to check active round:", error);
      }
    };
    checkActiveRound();
  }, []);

  // Handle WebSocket messages
  useEffect(() => {
    if (!lastMessage) return;

    switch (lastMessage.type) {
      case "ROUND_START":
        console.log("Round started:", lastMessage.roundId);
        setCurrentRoundId(lastMessage.roundId);
        setTrades([]);
        setShowVoting(true);
        setShowReveal(false);
        break;

      case "TRADE":
        console.log("New trade:", lastMessage.trade);
        setTrades((prev) => [...prev, lastMessage.trade]);
        break;

      case "ROUND_END":
        console.log("Round ended:", lastMessage.roundId);
        break;

      case "ROUND_REVEAL":
        console.log("Round revealed:", lastMessage.results);
        setRevealResults(lastMessage.results);
        setShowReveal(true);
        setShowVoting(false);
        break;
    }
  }, [lastMessage]);

  const handleStartRound = async () => {
    try {
      info("Starting new round...");
      const response = await fetch("http://localhost:4000/api/rounds/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duration: 120 }),
      });
      const data = await response.json();
      console.log("Round started:", data);
      
      // Immediately show voting panel with trades
      if (data.success) {
        setCurrentRoundId(data.roundId);
        setTrades(data.trades || []);
        setShowVoting(true);
        setShowReveal(false);
        success(`Round #${data.roundId} started! Vote on traders.`);
      } else {
        error("Failed to start round. Please try again.");
      }
    } catch (err) {
      console.error("Failed to start round:", err);
      error("Connection error. Check that backend is running.");
    }
  };

  const handleRevealRound = async () => {
    if (!currentRoundId) return;
    
    try {
      const response = await fetch(`http://localhost:4000/api/rounds/${currentRoundId}/reveal`, {
        method: "POST",
      });
      const data = await response.json();
      console.log("Round revealed:", data);
    } catch (error) {
      console.error("Failed to reveal round:", error);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      {/* Header */}
      <header className="border-b border-cyber-accent/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.h1
            className="text-3xl font-bold glow-text text-cyber-accent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            TuringArena
          </motion.h1>
          <div className="flex items-center gap-4">
            {isWrongNetwork && <AddMantleNetwork onSuccess={success} onError={error} />}
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyber-accent via-cyber-pink to-cyber-purple bg-clip-text text-transparent">
            Human vs AI Trading
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Can you tell AI from human by their trading decisions?
            <br />
            <span className="text-cyber-accent">Prove it — and earn rewards.</span>
          </p>
          <div className="flex gap-4 justify-center">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-cyber-accent to-cyber-pink rounded-lg font-bold text-lg hover:scale-105 transition-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartRound}
            >
              {showVoting ? "Round Active" : "Start New Round"}
            </motion.button>
            {showVoting && (
              <motion.button
                className="px-8 py-4 border-2 border-cyber-accent rounded-lg font-bold text-lg hover:bg-cyber-accent/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRevealRound}
              >
                Reveal Results
              </motion.button>
            )}
          </div>
          
          {/* WebSocket Status */}
          <div className="mt-4 text-sm">
            <span className={`inline-flex items-center gap-2 ${isConnected ? "text-green-400" : "text-red-400"}`}>
              <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"} animate-pulse`} />
              {isConnected ? "Live" : "Disconnected"}
            </span>
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="bg-cyber-card/50 backdrop-blur-sm py-8 border-y border-cyber-accent/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active Traders", value: "6" },
              { label: "Total Votes", value: "1,234" },
              { label: "Prize Pool", value: "$5,000" },
              { label: "Accuracy", value: "67%" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-cyber-accent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold mb-8 text-center">
          Meet the <span className="text-cyber-accent">AI Agents</span>
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <AgentCard agent={agent} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Voting Panel */}
      {showVoting && (
        <section className="container mx-auto px-4 py-16">
          <VotingPanel 
            trades={trades} 
            onRoundEnd={handleRevealRound}
            roundId={currentRoundId || 0}
            duration={120}
            onSuccess={success}
            onError={error}
            onWarning={warning}
          />
        </section>
      )}

      {/* Live Feed & Leaderboard */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <LiveFeed />
          <Leaderboard />
        </div>
      </section>

      {/* Reveal Animation */}
      {showReveal && (
        <RevealAnimation
          results={revealResults}
          onComplete={() => {
            setShowReveal(false);
            setShowVoting(false);
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-cyber-accent/20 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>Built for Turing Test Hackathon 2026 on Mantle Network</p>
          <p className="mt-2 text-sm">
            <a href="https://github.com" className="hover:text-cyber-accent transition-colors">
              GitHub
            </a>
            {" · "}
            <a href="https://twitter.com" className="hover:text-cyber-accent transition-colors">
              Twitter
            </a>
            {" · "}
            <a href="https://discord.com" className="hover:text-cyber-accent transition-colors">
              Discord
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
