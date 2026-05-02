"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { useSimpleVote } from "@/hooks/useSimpleVote";

interface Trade {
  id: string;
  traderId: number;
  traderName: string;
  action: "BUY" | "SELL" | "HOLD";
  amount: number;
  reasoning: string;
  timestamp: number;
  personality?: string;
}

interface VotingPanelProps {
  trades: Trade[];
  onRoundEnd?: () => void;
  roundId?: number;
  duration?: number;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onWarning?: (message: string) => void;
}

export function VotingPanel({ 
  trades, 
  onRoundEnd, 
  roundId = 0, 
  duration = 120,
  onSuccess,
  onError,
  onWarning,
}: VotingPanelProps) {
  const { address, isConnected } = useAccount();
  const { vote, isPending, isConfirming, isSuccess, error } = useSimpleVote();
  
  const [votes, setVotes] = useState<Record<number, boolean | null>>({});
  const [stakeAmount, setStakeAmount] = useState("0.01");
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRoundActive, setIsRoundActive] = useState(true);

  // Timer countdown
  useEffect(() => {
    setTimeLeft(duration);
    setIsRoundActive(true);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRoundActive(false);
          clearInterval(interval);
          onRoundEnd?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, onRoundEnd]);

  const handleVote = (traderId: number, isAI: boolean) => {
    setVotes(prev => ({ ...prev, [traderId]: isAI }));
  };

  const handleSubmit = async () => {
    if (!isConnected) {
      onWarning?.("Please connect your wallet first");
      return;
    }

    const traderIds = Object.keys(votes).map(Number);
    const votesAI = traderIds.map(id => votes[id] === true);

    if (traderIds.length === 0) {
      onWarning?.("Please vote on at least one trader");
      return;
    }

    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      onWarning?.("Please enter a valid stake amount (minimum 0.01 MNT)");
      return;
    }

    try {
      console.log("Submitting vote:", { roundId, traderIds, votesAI, stakeAmount });
      await vote(roundId, traderIds, votesAI, stakeAmount);
    } catch (error: any) {
      console.error("Vote failed:", error);
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      onError?.(`Vote failed: ${errorMessage}`);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      onSuccess?.("Vote submitted successfully! 🎉 Wait for results reveal.");
      setVotes({});
    }
  }, [isSuccess, onSuccess]);

  useEffect(() => {
    if (error) {
      console.error("Vote error:", error);
      onError?.(error.message || "Failed to submit vote");
    }
  }, [error, onError]);

  if (!isRoundActive) {
    return (
      <div className="bg-cyber-card border border-cyber-accent/30 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">No Active Round</h3>
        <p className="text-gray-400 mb-6">
          Wait for the next trading round to start voting
        </p>
        <div className="text-cyber-accent text-lg">
          Round #{roundId}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cyber-card border border-cyber-accent/30 rounded-xl p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">
          Vote: <span className="text-cyber-accent">AI or Human?</span>
        </h3>
        <div className="text-right">
          <div className="text-sm text-gray-400">Time Left</div>
          <motion.div
            className={`text-3xl font-bold ${
              timeLeft < 10 ? "text-red-500" : "text-cyber-accent"
            }`}
            animate={{ scale: timeLeft < 10 ? [1, 1.1, 1] : 1 }}
            transition={{ repeat: timeLeft < 10 ? Infinity : 0, duration: 1 }}
          >
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </motion.div>
        </div>
      </div>

      {/* Trades List */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {trades.map((trade) => (
          <motion.div
            key={trade.id}
            className="bg-cyber-dark/50 border border-cyber-accent/20 rounded-lg p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-bold text-lg">{trade.traderName}</div>
                <div className="text-sm text-gray-400">
                  {new Date(trade.timestamp).toLocaleTimeString()}
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full font-bold ${
                  trade.action === "BUY"
                    ? "bg-green-500/20 text-green-400"
                    : trade.action === "SELL"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {trade.action} {trade.amount > 0 ? `${trade.amount} MNT` : ""}
              </div>
            </div>

            <p className="text-gray-300 mb-4 text-sm">{trade.reasoning}</p>

            {/* Vote Buttons */}
            <div className="flex gap-3">
              <motion.button
                className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                  votes[trade.traderId] === true
                    ? "bg-cyber-accent text-black"
                    : "bg-cyber-accent/20 hover:bg-cyber-accent/30"
                }`}
                onClick={() => handleVote(trade.traderId, true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🤖 AI
              </motion.button>
              <motion.button
                className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                  votes[trade.traderId] === false
                    ? "bg-cyber-pink text-black"
                    : "bg-cyber-pink/20 hover:bg-cyber-pink/30"
                }`}
                onClick={() => handleVote(trade.traderId, false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                👤 Human
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stake Amount */}
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-2">
          Stake Amount (MNT)
        </label>
        <input
          type="number"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
          step="0.01"
          min="0.01"
          className="w-full bg-cyber-dark/80 border border-cyber-accent/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-accent focus:ring-2 focus:ring-cyber-accent/50"
          placeholder="0.01"
          style={{ colorScheme: 'dark' }}
        />
        <div className="text-xs text-gray-500 mt-1">
          Higher stakes = bigger rewards if you're correct
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
          isPending || isConfirming || Object.keys(votes).length === 0
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-gradient-to-r from-cyber-accent to-cyber-pink hover:scale-105"
        }`}
        onClick={handleSubmit}
        disabled={isPending || isConfirming || Object.keys(votes).length === 0}
        whileHover={{ scale: Object.keys(votes).length > 0 && !isPending && !isConfirming ? 1.02 : 1 }}
        whileTap={{ scale: 0.98 }}
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span>
            Confirm in Wallet...
          </span>
        ) : isConfirming ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span>
            Submitting Vote...
          </span>
        ) : (
          `Submit ${Object.keys(votes).length} Vote${
            Object.keys(votes).length !== 1 ? "s" : ""
          }`
        )}
      </motion.button>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-cyber-accent/20 flex justify-between text-sm text-gray-400">
        <div>Round #{roundId}</div>
        <div>{trades.length} traders</div>
        <div>Stake: {stakeAmount} MNT</div>
      </div>
    </div>
  );
}
