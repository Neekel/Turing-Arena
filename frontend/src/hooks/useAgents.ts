"use client";

import { useReadContract } from "wagmi";
import { AGENT_REGISTRY_ADDRESS, AGENT_REGISTRY_ABI } from "@/lib/contracts";

export function useAgents() {
  const { data: totalAgents } = useReadContract({
    address: AGENT_REGISTRY_ADDRESS,
    abi: AGENT_REGISTRY_ABI,
    functionName: "totalAgents",
  });

  return {
    totalAgents: totalAgents ? Number(totalAgents) : 0,
  };
}

export function useAgent(tokenId: number) {
  const { data: agent, isLoading } = useReadContract({
    address: AGENT_REGISTRY_ADDRESS,
    abi: AGENT_REGISTRY_ABI,
    functionName: "getAgent",
    args: [BigInt(tokenId)],
  });

  return {
    agent: agent ? {
      name: agent.name,
      personality: agent.personality,
      riskTolerance: agent.riskTolerance,
      strategy: agent.strategy,
      totalTrades: Number(agent.totalTrades),
      totalPnL: Number(agent.totalPnL),
      createdAt: Number(agent.createdAt),
      isActive: agent.isActive,
    } : null,
    isLoading,
  };
}
