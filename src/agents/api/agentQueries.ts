import { useQuery } from '@tanstack/react-query';
import { agentKeys } from '@/shared';
import { listAgents, getAgent, getThreadHistory } from './agentApi';

/**
 * Query hook to list all agents
 */
export const useAgentsQuery = () => {
  return useQuery({
    queryKey: agentKeys.list(),
    queryFn: listAgents,
    staleTime: 5 * 60 * 1000, // 5 minutes - agents don't change frequently
  });
};

/**
 * Query hook to get a specific agent
 */
export const useAgentQuery = (agentId: string, enabled = true) => {
  return useQuery({
    queryKey: agentKeys.detail(agentId),
    queryFn: () => getAgent(agentId),
    enabled: enabled && !!agentId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Query hook to get thread message history
 */
export const useThreadHistoryQuery = (
  agentId: string,
  threadId: string,
  enabled = true
) => {
  return useQuery({
    queryKey: agentKeys.thread(agentId, threadId),
    queryFn: () => getThreadHistory(agentId, threadId),
    enabled: enabled && !!agentId && !!threadId,
    staleTime: 0, // Always fetch fresh chat history
    refetchOnMount: true,
  });
};
