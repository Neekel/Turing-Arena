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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const WS_URL = API_URL.replace("https://", "wss://").replace("http://", "ws://");

  const { isConnected, lastMessage } = useWebSocket(WS_URL);
  const { chain } = useAccount();
  const { toasts, removeToast, success, error, warning, info } = useToast();

  const isWrongNetwork = chain && chain.id !== 5003;

  useEffect(() => {
    const checkActiveRound = async () => {
      try {
        const response = await fetch(`${API_URL}/api/rounds/active/current`);
        const data = await response.json();
        if (data.round) {
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

  useEffect(() => {
    if (!lastMessage) return;
    switch (lastMessage.type) {
      case "ROUND_START":
        setCurrentRoundId(lastMessage.roundId);
        setTrades([]);
        setShowVoting(true);
        setShowReveal(false);
        break;
      case "TRADE":
        setTrades((prev) => [...prev, lastMessage.trade]);
        break;
      case "ROUND_END":
        break;
      case "ROUND_REVEAL":
        setRevealResults(lastMessage.results);
        setShowReveal(true);
        setShowVoting(false);
        break;
    }
  }, [lastMessage]);

  const handleStartRound = async () => {
    try {
      info("Starting new round...");
      const response = await fetch(`${API_URL}/api/rounds/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duration: 120 }),
      });
      const data = await response.json();
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
      const response = await fetch(`${API_URL}/api/rounds/${currentRoundId}/reveal`, {
        method: "POST",
      });
      const data = await response.json();
      console.log("Round revealed:", data);
    } catch (error) {
      console.error("Failed to reveal round:", error);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0e27]">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <header className="border-b border-[#00f0ff]/20 sticky top-0 z-50 bg-[#0a0e27]/95 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#00f0ff] rounded-sm flex items-center justify-center">
              <span className="text-black font-bold text-sm font-mono">T</span>
            </div>
            <div>
              <h1 className="text-xl font-mono font-bold text-white uppercase tracking-wider">
                TuringArena
              </h1>
              <p className="text-[10px] font-mono text-[#00f0ff]/60">
                Human vs AI Trading · Mantle Network
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-sm border text-xs font-mono ${isConnected ? "border-green-500/30 text-green-400" : "border-red-500/30 text-red-400"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"} animate-pulse`} />
              {isConnected ? "Live" : "Offline"}
            </div>
            {isWrongNetwork && <AddMantleNetwork onSuccess={success} onError={error} />}
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#00f0ff]/30 rounded-sm mb-8 text-sm font-mono text-[#00f0ff]">
            <span className="w-2 h-2 bg-[#00f0ff] rounded-full animate-pulse" />
            Turing Test Hackathon 2026 · $100K Prize Pool
          </div>

          <h2 className="text-6xl md:text-8xl font-bold mb-6 font-mono leading-none">
            <span className="text-white">Human</span>
            <br />
            <span className="text-[#00f0ff] neon-text">vs AI</span>
            <br />
            <span className="text-[#ff006e] neon-text">Trading</span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-2xl mx-auto font-mono">
            Can you tell AI from human by their trading decisions?
          </p>
          <p className="text-lg text-[#00f0ff] mb-10 font-mono">
            Prove it — and earn rewards on Mantle Network.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <motion.button
              className="px-8 py-4 bg-[#00f0ff] text-black font-bold text-lg font-mono rounded-sm hover:bg-[#00d4e6] transition-colors"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleStartRound}>
              {showVoting ? "▶ Round Active" : "▶ Start New Round"}
            </motion.button>
            {showVoting && (
              <motion.button
                className="px-8 py-4 border-2 border-[#ff006e] text-[#ff006e] font-bold text-lg font-mono rounded-sm hover:bg-[#ff006e]/10 transition-colors"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleRevealRound}>
                ⚡ Reveal Results
              </motion.button>
            )}
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-[#00f0ff]/10 bg-[#1a1f3a]/50 py-6">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Active Traders", value: "6", color: "text-[#00f0ff]", sub: "this round" },
              { label: "Total Votes", value: "1,234", color: "text-[#00ff88]", sub: "all time" },
              { label: "Prize Pool", value: "$5,000", color: "text-[#ff006e]", sub: "current" },
              { label: "Accuracy", value: "67%", color: "text-[#8b5cf6]", sub: "avg voter" },
            ].map((stat, i) => (
              <motion.div key={stat.label}
                className="bg-[#0a0e27] border border-[#00f0ff]/10 rounded-sm p-4"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}>
                <div className="text-xs font-mono text-gray-500 uppercase mb-1">{stat.label}</div>
                <div className={`text-3xl font-mono font-bold tabular-nums ${stat.color}`}>{stat.value}</div>
                <div className="text-xs font-mono text-gray-600 mt-0.5">{stat.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agents */}
      <section className="container mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-mono font-bold text-white uppercase tracking-wider">AI Agents</h3>
            <p className="text-sm font-mono text-gray-400 mt-1">3 distinct personalities · Can you identify them?</p>
          </div>
          <div className="text-xs font-mono text-[#00f0ff] px-3 py-1.5 border border-[#00f0ff]/30 rounded-sm">
            Round #{currentRoundId ?? "—"}
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {agents.map((agent, i) => (
            <motion.div key={agent.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
              <AgentCard agent={agent} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Voting Panel */}
      {showVoting && (
        <section className="container mx-auto px-6 py-8">
          <VotingPanel trades={trades} onRoundEnd={handleRevealRound} roundId={currentRoundId || 0}
            duration={120} onSuccess={success} onError={error} onWarning={warning} />
        </section>
      )}

      {/* Live Feed & Leaderboard */}
      <section className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-4">
          <LiveFeed />
          <Leaderboard />
        </div>
      </section>

      {showReveal && (
        <RevealAnimation results={revealResults} onComplete={() => { setShowReveal(false); setShowVoting(false); }} />
      )}

      {/* Footer */}
      <footer className="border-t border-[#00f0ff]/10 py-6 mt-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-500 font-mono text-sm">Built for Turing Test Hackathon 2026 · Mantle Network</p>
          <div className="flex items-center justify-center gap-4 mt-2 text-xs font-mono">
            <a href="https://github.com" className="text-gray-500 hover:text-[#00f0ff] transition-colors">GitHub</a>
            <span className="text-gray-700">·</span>
            <a href="https://twitter.com" className="text-gray-500 hover:text-[#00f0ff] transition-colors">Twitter</a>
            <span className="text-gray-700">·</span>
            <a href="https://discord.com" className="text-gray-500 hover:text-[#00f0ff] transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
