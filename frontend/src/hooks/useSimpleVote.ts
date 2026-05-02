"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { parseEther, encodeFunctionData } from "viem";
import { VOTING_POOL_ADDRESS, VOTING_POOL_ABI } from "@/lib/contracts";

export function useSimpleVote() {
  const { address, chain } = useAccount();
  
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const vote = async (
    roundId: number,
    traderIds: number[],
    votesAI: boolean[],
    stakeAmount: string = "0.01"
  ) => {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    if (!window.ethereum) {
      throw new Error("MetaMask not installed");
    }

    if (!chain || chain.id !== 5003) {
      throw new Error("Please switch to Mantle Sepolia Testnet (Chain ID: 5003)");
    }

    try {
      setIsPending(true);
      setError(null);
      setIsSuccess(false);

      console.log("=== VOTE TRANSACTION START ===");
      console.log("Preparing transaction:", {
        roundId,
        traderIds,
        votesAI,
        stakeAmount,
        from: address,
        to: VOTING_POOL_ADDRESS,
        chainId: chain?.id,
        chainName: chain?.name,
      });

      // Encode function data using viem
      const data = encodeFunctionData({
        abi: VOTING_POOL_ABI,
        functionName: "vote",
        args: [BigInt(roundId), traderIds.map(id => BigInt(id)), votesAI],
      });

      const value = parseEther(stakeAmount);
      console.log("Encoded data:", data);
      console.log("Value (wei):", value.toString());
      console.log("Value (hex):", '0x' + value.toString(16));

      // Send transaction directly through MetaMask
      // This bypasses wagmi's RPC configuration
      const txParams = {
        from: address,
        to: VOTING_POOL_ADDRESS,
        value: '0x' + value.toString(16),
        data: data,
      };
      
      console.log("Transaction params:", txParams);
      console.log("Sending transaction via eth_sendTransaction...");

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      }) as `0x${string}`;

      console.log("✅ Transaction sent! Hash:", txHash);
      setHash(txHash);
      setIsPending(false);
      setIsConfirming(true);

      // Wait for confirmation using MetaMask's RPC
      console.log("Waiting for confirmation...");
      let receipt = null;
      let attempts = 0;
      const maxAttempts = 60; // 2 minutes max

      while (!receipt && attempts < maxAttempts) {
        try {
          receipt = await window.ethereum.request({
            method: 'eth_getTransactionReceipt',
            params: [txHash],
          });
          
          if (!receipt) {
            // Wait 2 seconds before next attempt
            await new Promise(resolve => setTimeout(resolve, 2000));
            attempts++;
            if (attempts % 5 === 0) {
              console.log(`Still waiting... (${attempts}/${maxAttempts})`);
            }
          }
        } catch (err) {
          console.error("Error checking receipt:", err);
          await new Promise(resolve => setTimeout(resolve, 2000));
          attempts++;
        }
      }

      if (!receipt) {
        throw new Error("Transaction confirmation timeout");
      }

      console.log("✅ Transaction confirmed!");
      console.log("Receipt:", receipt);
      console.log("Status:", receipt.status);
      console.log("=== VOTE TRANSACTION END ===");

      setIsConfirming(false);
      setIsSuccess(true);
    } catch (err: any) {
      console.error("=== VOTE TRANSACTION ERROR ===");
      console.error("Error type:", err?.constructor?.name);
      console.error("Error code:", err?.code);
      console.error("Error message:", err?.message);
      console.error("Full error:", err);
      console.error("=== ERROR END ===");
      
      setIsPending(false);
      setIsConfirming(false);
      setError(err);
      throw err;
    }
  };

  return {
    vote,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

// Extend window type for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
