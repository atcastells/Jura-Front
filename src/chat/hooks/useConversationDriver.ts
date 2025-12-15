import { useState, useCallback, useMemo, useEffect } from 'react';
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
  const [isCreating, setIsCreating] = useState(false);
  const createAgentMutation = useCreateAgentMutation();

  const existingAgent = useMemo(() => {
    if (isLoadingAgents || !agents) return null;

    return (
      agents.find((a) => a.name === PROFILE_BUILDER_AGENT_NAME && a.type === 'PRIVATE') || null
    );
  }, [agents, isLoadingAgents]);

  useEffect(() => {
    if (isLoadingAgents || existingAgent || createdAgentId || isCreating) return;

    setIsCreating(true);
    createAgentMutation.mutate(PROFILE_BUILDER_AGENT_CONFIG, {
      onSuccess: (newAgent) => {
        setCreatedAgentId(newAgent.id);
        setIsCreating(false);
      },
      onError: (err) => {
        setError(`Failed to initialize agent: ${err.message}`);
        setIsCreating(false);
      },
    });
  }, [isLoadingAgents, existingAgent, createdAgentId, isCreating, createAgentMutation]);

  const agentId = existingAgent?.id || createdAgentId;

  return { agentId, error };
};

/**
 * Hook to ensure thread exists for agent
 */
const useEnsureThread = (agentId: string | null) => {
  const [createdThreadId, setCreatedThreadId] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isCreating, setIsCreating] = useState(false);
  const createThreadMutation = useCreateThreadMutation();

  const storedThreadId = useMemo(() => {
    if (!agentId) return null;
    return localStorage.getItem(THREAD_STORAGE_KEY(agentId));
  }, [agentId]);

  useEffect(() => {
    if (!agentId || storedThreadId || createdThreadId || isCreating) return;

    setIsCreating(true);
    createThreadMutation.mutate(
      { agentId },
      {
        onSuccess: (newThread) => {
          setCreatedThreadId(newThread.id);
          localStorage.setItem(THREAD_STORAGE_KEY(agentId), newThread.id);
          setIsCreating(false);
        },
        onError: (err) => {
          setError(`Failed to create thread: ${err.message}`);
          setIsCreating(false);
        },
      }
    );
  }, [agentId, storedThreadId, createdThreadId, isCreating, createThreadMutation]);

  const threadId = storedThreadId || createdThreadId;

  return { threadId, error };
};

/**
 * Backend-driven conversation driver using agent + thread endpoints
 */
export const useConversationDriver = () => {
  const [sendError, setSendError] = useState<string | undefined>(undefined);
  const [optimisticTurns, setOptimisticTurns] = useState<ConversationTurn[]>([]);
  const [isSending, setIsSending] = useState(false);

  // Queries and mutations
  const { data: agents, isLoading: isLoadingAgents } = useAgentsQuery();
  const sendChatMutation = useSendChatMessageMutation();

  // Ensure agent and thread exist
  const { agentId, error: agentError } = useEnsureAgent(agents, isLoadingAgents);
  const { threadId, error: threadError } = useEnsureThread(agentId);

  // Load thread history when agent and thread are ready
  const { data: threadHistory, isLoading: isLoadingHistory, refetch: refetchThread } = useThreadHistoryQuery(
    agentId || '',
    threadId || '',
    !!(agentId && threadId)
  );

  // Compute turns from thread history
  const turnsFromHistory = threadHistory ? threadHistory.map(mapChatMessageToTurn) : [];
  // Merge optimistic turns (user message and placeholder) with fetched history
  const turns = useMemo(() => {
    if (optimisticTurns.length === 0) return turnsFromHistory;
    // Avoid duplicates: filter out any history turn that matches optimistic ids
    const optimisticIds = new Set(optimisticTurns.map((t) => t.id));
    const merged = [...turnsFromHistory.filter((t) => !optimisticIds.has(t.id)), ...optimisticTurns];
    // Sort by timestamp to keep order
    return merged.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [turnsFromHistory, optimisticTurns]);

  // Compute loading state
  const isLoading = isLoadingAgents || isLoadingHistory || !agentId || !threadId || isSending;

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
      setIsSending(true);

      // Add optimistic user turn immediately
      const optimisticUserTurn: ConversationTurn = {
        id: `optimistic-user-${Date.now()}`,
        role: 'user',
        content: message,
        timestamp: new Date(),
        blocks: undefined,
      };

      // Add a lightweight typing/progress placeholder for agent
      const optimisticAgentTyping: ConversationTurn = {
        id: `optimistic-agent-${Date.now()}`,
        role: 'assistant',
        content: '...',
        timestamp: new Date(new Date().getTime() + 1), // slightly after user
        blocks: undefined,
      };

      setOptimisticTurns((prev) => [...prev, optimisticUserTurn, optimisticAgentTyping]);

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
            // Remove optimistic typing indicator
            setOptimisticTurns((prev) => prev.filter((t) => !t.id.startsWith('optimistic-')));
            setIsSending(false);
          },
          onSuccess: async () => {
            // Explicitly refetch thread history endpoint to refresh messages
            try {
              await refetchThread();
            } finally {
              // After server response arrives, hide optimistic turns
              setOptimisticTurns([]);
              setIsSending(false);
            }
          },
        }
      );
    },
    [agentId, threadId, sendChatMutation, refetchThread]
  );

  return {
    conversation,
    sendMessage,
  };
};
