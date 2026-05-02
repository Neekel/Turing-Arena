"use client";

import { motion } from "framer-motion";

interface AddMantleNetworkProps {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export function AddMantleNetwork({ onSuccess, onError }: AddMantleNetworkProps) {
  const addMantleSepoliaToMetaMask = async () => {
    if (!window.ethereum) {
      onError?.("MetaMask is not installed! Please install MetaMask.");
      return;
    }

    try {
      // First try to switch to the network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x138B' }], // 5003 in hex
        });
        onSuccess?.("✅ Switched to Mantle Sepolia Testnet!");
        return;
      } catch (switchError: any) {
        // If network doesn't exist (error code 4902), add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x138B', // 5003 in hex
              chainName: 'Mantle Sepolia Testnet',
              nativeCurrency: {
                name: 'MNT',
                symbol: 'MNT',
                decimals: 18
              },
              rpcUrls: ['https://rpc.sepolia.mantle.xyz'],
              blockExplorerUrls: ['https://sepolia.mantlescan.xyz']
            }]
          });
          
          onSuccess?.("✅ Mantle Sepolia added to MetaMask! Network switched.");
        } else {
          throw switchError;
        }
      }
    } catch (error: any) {
      console.error("Failed to add/switch network:", error);
      onError?.(`Failed to add/switch network: ${error.message || error.toString()}`);
    }
  };

  return (
    <motion.button
      onClick={addMantleSepoliaToMetaMask}
      className="px-6 py-3 bg-yellow-500/20 border-2 border-yellow-500 rounded-lg font-bold hover:bg-yellow-500/30 transition-colors text-sm"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      ⚠️ Add Mantle Sepolia
    </motion.button>
  );
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
