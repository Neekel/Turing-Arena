"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  const colors = {
    success: "from-green-500/20 to-green-600/20 border-green-500",
    error: "from-red-500/20 to-red-600/20 border-red-500",
    warning: "from-yellow-500/20 to-yellow-600/20 border-yellow-500",
    info: "from-blue-500/20 to-blue-600/20 border-blue-500",
  };

  const textColors = {
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`fixed top-20 right-4 z-[100] max-w-md bg-gradient-to-r ${colors[type]} border-2 rounded-xl p-4 backdrop-blur-lg shadow-2xl`}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{icons[type]}</div>
        <div className="flex-1">
          <p className={`font-bold ${textColors[type]} mb-1`}>
            {type === "success" && "Success!"}
            {type === "error" && "Error!"}
            {type === "warning" && "Warning!"}
            {type === "info" && "Info"}
          </p>
          <p className="text-white text-sm leading-relaxed">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors text-xl leading-none"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: ToastType }>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-0 right-0 z-[100] pointer-events-none">
      <div className="pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast, index) => (
            <motion.div
              key={toast.id}
              layout
              style={{ marginTop: index > 0 ? "1rem" : "0" }}
            >
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => onRemove(toast.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
