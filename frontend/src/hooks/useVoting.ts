"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { VOTING_POOL_ADDRESS, VOTING_POOL_ABI } from "@/lib/contracts";

export function useCurrentRound() {
  const { data: roundId, refetch } = useReadContract({
    address: VOTING_POOL_ADDRESS,
    abi: VOTING_POOL_ABI,
    functionName: "currentRoundId",
  });

  return {
    roundId: roundId ? Number(roundId) : 0,
    refetch,
  };
}

export function useRoundStats(roundId: number) {
  const { data: stats, isLoading } = useReadContract({
    address: VOTING_POOL_ADDRESS,
    abi: VOTING_POOL_ABI,
    functionName: "getRoundStats",
    args: [BigInt(roundId)],
  });

  return {
    stats: stats ? {
      startTime: Number(stats[0]),
      endTime: Number(stats[1]),
      totalStaked: Number(stats[2]),
      totalVoters: Number(stats[3]),
      isRevealed: stats[4],
    } : null,
    isLoading,
  };
}

export function useVote() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const vote = async (
    roundId: number,
    traderIds: number[],
    votesAI: boolean[],
    stakeAmount: string = "0.01" // Default 0.01 MNT
  ) => {
    writeContract({
      address: VOTING_POOL_ADDRESS,
      abi: VOTING_POOL_ABI,
      functionName: "vote",
      args: [BigInt(roundId), traderIds.map(id => BigInt(id)), votesAI],
      value: parseEther(stakeAmount),
    });
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
