import { useMutation, useQueryClient } from '@tanstack/react-query';
import { agentKeys } from '@/shared';
import { createAgent, createThread, sendChatMessage } from './agentApi';
import type { CreateAgentPayload, CreateThreadPayload, ChatPayload } from '../types';

/**
 * Mutation hook to create a new agent
 */
export const useCreateAgentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAgentPayload) => createAgent(payload),
    onSuccess: () => {
      // Invalidate agents list to refetch
      queryClient.invalidateQueries({ queryKey: agentKeys.list() });
    },
  });
};

/**
 * Mutation hook to create a thread for an agent
 */
export const useCreateThreadMutation = () => {
  return useMutation({
    mutationFn: ({
      agentId,
      payload,
    }: {
      agentId: string;
      payload?: CreateThreadPayload;
    }) => createThread(agentId, payload),
  });
};

/**
 * Mutation hook to send a chat message
 */
export const useSendChatMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ agentId, payload }: { agentId: string; payload: ChatPayload }) =>
      sendChatMessage(agentId, payload),
    onSuccess: (data, variables) => {
      // Invalidate thread history to refetch messages
      if (data.threadId) {
        queryClient.invalidateQueries({
          queryKey: agentKeys.thread(variables.agentId, data.threadId),
        });
      }
    },
  });
};
