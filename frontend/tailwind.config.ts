import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#0a0e27",
          card: "#1a1f3a",
          accent: "#00f0ff",
          pink: "#ff006e",
          purple: "#8b5cf6",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px #00f0ff, 0 0 10px #00f0ff" },
          "100%": { boxShadow: "0 0 10px #00f0ff, 0 0 20px #00f0ff, 0 0 30px #00f0ff" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
