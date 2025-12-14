import { apiClient } from '@/shared';
import type {
  Agent,
  Thread,
  ChatMessage,
  CreateAgentPayload,
  CreateThreadPayload,
  ChatPayload,
  ChatResponse,
} from '../types';

const AGENT_ENDPOINTS = {
  list: '/api/v1/agents',
  detail: (id: string) => `/api/v1/agents/${id}`,
  createThread: (id: string) => `/api/v1/agents/${id}/threads`,
  threadHistory: (id: string, threadId: string) =>
    `/api/v1/agents/${id}/threads/${threadId}/messages`,
  chat: (id: string) => `/api/v1/agents/${id}/chat`,
} as const;

/**
 * List all agents
 */
export const listAgents = async (): Promise<Agent[]> => {
  return apiClient.get<Agent[]>(AGENT_ENDPOINTS.list);
};

/**
 * Get agent by ID
 */
export const getAgent = async (agentId: string): Promise<Agent> => {
  return apiClient.get<Agent>(AGENT_ENDPOINTS.detail(agentId));
};

/**
 * Create a new agent
 */
export const createAgent = async (payload: CreateAgentPayload): Promise<Agent> => {
  return apiClient.post<Agent>(AGENT_ENDPOINTS.list, payload);
};

/**
 * Create a thread for an agent
 */
export const createThread = async (
  agentId: string,
  payload?: CreateThreadPayload
): Promise<Thread> => {
  return apiClient.post<Thread>(AGENT_ENDPOINTS.createThread(agentId), payload || {});
};

/**
 * Get thread message history
 */
export const getThreadHistory = async (
  agentId: string,
  threadId: string
): Promise<ChatMessage[]> => {
  return apiClient.get<ChatMessage[]>(AGENT_ENDPOINTS.threadHistory(agentId, threadId));
};

/**
 * Send a message to an agent (with optional threadId)
 */
export const sendChatMessage = async (
  agentId: string,
  payload: ChatPayload
): Promise<ChatResponse> => {
  return apiClient.post<ChatResponse>(AGENT_ENDPOINTS.chat(agentId), payload);
};
