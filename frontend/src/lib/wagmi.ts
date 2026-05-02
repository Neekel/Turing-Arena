import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mantle } from "wagmi/chains";
import { defineChain } from "viem";

// Mantle Sepolia Testnet
export const mantleSepolia = defineChain({
  id: 5003,
  name: "Mantle Sepolia Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "MNT",
    symbol: "MNT",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.sepolia.mantle.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Mantle Sepolia Explorer",
      url: "https://sepolia.mantlescan.xyz",
    },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: "TuringArena",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "5144e91fa1dcd002e78fcc8d6c8df3e9",
  chains: [mantleSepolia, mantle],
  ssr: true,
});
