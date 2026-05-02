"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface TraderResult {
  traderId: number;
  traderName: string;
  isAI: boolean;
  correctVotes: number;
  totalVotes: number;
  accuracy: number;
}

interface RevealAnimationProps {
  results: TraderResult[];
  onComplete?: () => void;
}

export function RevealAnimation({ results, onComplete }: RevealAnimationProps) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (currentIndex < results.length - 1) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (currentIndex === results.length - 1) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, results.length, onComplete]);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.h2
          className="text-4xl font-bold text-center mb-12 text-cyber-accent"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🎭 Revealing Identities...
        </motion.h2>

        <div className="space-y-6">
          <AnimatePresence>
            {results.map((result, index) => (
              index <= currentIndex && (
                <motion.div
                  key={result.traderId}
                  className="bg-cyber-card border-2 border-cyber-accent/50 rounded-xl p-6"
                  initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ duration: 0.6, type: "spring" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.div
                        className={`text-6xl`}
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 0.6 }}
                      >
                        {result.isAI ? "🤖" : "👤"}
                      </motion.div>
                      <div>
                        <div className="text-2xl font-bold">{result.traderName}</div>
                        <div className={`text-lg ${result.isAI ? "text-cyber-accent" : "text-cyber-pink"}`}>
                          {result.isAI ? "AI Agent" : "Human Trader"}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-3xl font-bold text-cyber-accent">
                        {result.accuracy.toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-400">
                        {result.correctVotes}/{result.totalVotes} correct
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <motion.div
                    className="mt-4 h-2 bg-cyber-dark rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyber-accent to-cyber-pink"
                      initial={{ width: 0 }}
                      animate={{ width: `${result.accuracy}%` }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    />
                  </motion.div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>

        {/* Confetti Effect */}
        {showConfetti && (
          <motion.div
            className="fixed inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -50,
                  rotate: 0,
                }}
                animate={{
                  y: window.innerHeight + 50,
                  rotate: 360,
                  x: Math.random() * window.innerWidth,
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  ease: "linear",
                }}
              >
                {["🎉", "✨", "🎊", "⭐", "💫"][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}
          </motion.div>
        )}

        {currentIndex === results.length - 1 && (
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="text-2xl font-bold text-cyber-accent mb-2">
              Round Complete! 🎉
            </div>
            <div className="text-gray-400">
              Rewards will be distributed shortly...
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
