import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mantle } from "wagmi/chains";
import { defineChain } from "viem";
import { http, createConfig, fallback } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";

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
      http: ["https://rpc.ankr.com/mantle_sepolia"],
    },
    public: {
      http: ["https://rpc.ankr.com/mantle_sepolia"],
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

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "5144e91fa1dcd002e78fcc8d6c8df3e9";

// Multiple RPC endpoints for fallback
const mantleSepoliaTransport = fallback([
  http("https://rpc.ankr.com/mantle_sepolia", {
    batch: false,
    retryCount: 3,
    timeout: 30000,
  }),
  http("https://rpc.sepolia.mantle.xyz", {
    batch: false,
    retryCount: 2,
    timeout: 20000,
  }),
]);

export const config = createConfig({
  chains: [mantleSepolia, mantle],
  transports: {
    [mantleSepolia.id]: mantleSepoliaTransport,
    [mantle.id]: http("https://rpc.mantle.xyz", {
      batch: false,
      retryCount: 3,
      timeout: 30000,
    }),
  },
  connectors: [
    injected(),
    walletConnect({
      projectId,
      showQrModal: true,
    }),
  ],
  ssr: true,
});
