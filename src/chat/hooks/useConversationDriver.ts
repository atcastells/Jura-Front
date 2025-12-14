import { useState, useCallback, useMemo } from 'react';
import type { ConversationTurn, ConversationState } from '../types';
import type { ChatMessage, Agent } from '@/agents';
import {
  useAgentsQuery,
  useCreateAgentMutation,
  useCreateThreadMutation,
  useThreadHistoryQuery,
  useSendChatMessageMutation,
} from '@/agents';

// Agent configuration constants
const PROFILE_BUILDER_AGENT_NAME = 'Profile Builder';
const PROFILE_BUILDER_AGENT_CONFIG = {
  name: PROFILE_BUILDER_AGENT_NAME,
  type: 'PRIVATE' as const,
  tone: 'PROFESSIONAL' as const,
  instructions:
    'You are a helpful AI career agent assisting users in building recruiter-ready profiles. Guide them through adding their professional experience, skills, and achievements.',
  enableThreads: true,
};

const THREAD_STORAGE_KEY = (agentId: string) => `jura-thread-${agentId}`;

/**
 * Maps backend ChatMessage to frontend ConversationTurn
 */
const mapChatMessageToTurn = (message: ChatMessage): ConversationTurn => ({
  id: message.id,
  role: message.role,
  content: message.content,
  timestamp: new Date(message.createdAt),
  blocks: undefined, // Future: parse blocks from message.metadata
});

/**
 * Hook to ensure Profile Builder agent exists
 */
const useEnsureAgent = (agents: Agent[] | undefined, isLoadingAgents: boolean) => {
  const [createdAgentId, setCreatedAgentId] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const createAgentMutation = useCreateAgentMutation();

  // Find or create agent
  const agentId = useMemo(() => {
    if (isLoadingAgents || !agents) return null;

    const existingAgent = agents.find(
      (a) => a.name === PROFILE_BUILDER_AGENT_NAME && a.type === 'PRIVATE'
    );

    if (existingAgent) {
      return existingAgent.id;
    }

    // Return created agent ID if we already created one
    if (createdAgentId) {
      return createdAgentId;
    }

    // Trigger creation
    createAgentMutation.mutate(
      PROFILE_BUILDER_AGENT_CONFIG,
      {
        onSuccess: (newAgent) => {
          setCreatedAgentId(newAgent.id);
        },
        onError: (err) => {
          setError(`Failed to initialize agent: ${err.message}`);
        },
      }
    );

    return null;
  }, [agents, isLoadingAgents, createdAgentId, createAgentMutation]);

  return { agentId, error };
};

/**
 * Hook to ensure thread exists for agent
 */
const useEnsureThread = (agentId: string | null) => {
  const [createdThreadId, setCreatedThreadId] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const createThreadMutation = useCreateThreadMutation();

  // Find or create thread
  const threadId = useMemo(() => {
    if (!agentId) return null;

    // Check localStorage first
    const storedThreadId = localStorage.getItem(THREAD_STORAGE_KEY(agentId));
    if (storedThreadId) {
      return storedThreadId;
    }

    // Return created thread ID if we already created one
    if (createdThreadId) {
      return createdThreadId;
    }

    // Trigger creation
    createThreadMutation.mutate(
      { agentId },
      {
        onSuccess: (newThread) => {
          setCreatedThreadId(newThread.id);
          localStorage.setItem(THREAD_STORAGE_KEY(agentId), newThread.id);
        },
        onError: (err) => {
          setError(`Failed to create thread: ${err.message}`);
        },
      }
    );

    return null;
  }, [agentId, createdThreadId, createThreadMutation]);

  return { threadId, error };
};

/**
 * Backend-driven conversation driver using agent + thread endpoints
 */
export const useConversationDriver = () => {
  const [sendError, setSendError] = useState<string | undefined>(undefined);

  // Queries and mutations
  const { data: agents, isLoading: isLoadingAgents } = useAgentsQuery();
  const sendChatMutation = useSendChatMessageMutation();

  // Ensure agent and thread exist
  const { agentId, error: agentError } = useEnsureAgent(agents, isLoadingAgents);
  const { threadId, error: threadError } = useEnsureThread(agentId);

  // Load thread history when agent and thread are ready
  const { data: threadHistory, isLoading: isLoadingHistory } = useThreadHistoryQuery(
    agentId || '',
    threadId || '',
    !!(agentId && threadId)
  );

  // Compute turns from thread history
  const turns = threadHistory ? threadHistory.map(mapChatMessageToTurn) : [];

  // Compute loading state
  const isLoading = isLoadingAgents || isLoadingHistory || !agentId || !threadId;

  // Combine errors
  const error = agentError || threadError || sendError;

  // Build conversation state
  const conversation: ConversationState = {
    turns,
    isLoading,
    error,
  };

  const sendMessage = useCallback(
    (message: string) => {
      if (!message.trim() || !agentId || !threadId) return;

      // Clear previous send errors
      setSendError(undefined);

      // Send to backend
      sendChatMutation.mutate(
        {
          agentId,
          payload: {
            message,
            threadId,
          },
        },
        {
          onError: (err) => {
            setSendError(`Failed to send message: ${err.message}`);
          },
        }
      );
    },
    [agentId, threadId, sendChatMutation]
  );

  return {
    conversation,
    sendMessage,
  };
};
