import type { Timestamps } from '@/shared';

/**
 * Agent types
 */
export type AgentType = 'PRIVATE' | 'PUBLIC';

export type AgentTone = 'PROFESSIONAL' | 'FRIENDLY' | 'CASUAL' | 'FORMAL';

/**
 * Agent entity
 */
export interface Agent extends Timestamps {
  id: string;
  name: string;
  type: AgentType;
  tone?: AgentTone;
  instructions?: string;
  enableThreads: boolean;
}

/**
 * Thread entity
 */
export interface Thread extends Timestamps {
  id: string;
  agentId: string;
  title?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Chat message entity from backend
 */
export interface ChatMessage extends Timestamps {
  id: string;
  threadId: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: Record<string, unknown>;
}

/**
 * API Payloads
 */
export interface CreateAgentPayload {
  name: string;
  type: AgentType;
  tone?: AgentTone;
  instructions?: string;
  enableThreads: boolean;
}

export interface CreateThreadPayload {
  title?: string;
  metadata?: Record<string, unknown>;
}

export interface ChatPayload {
  message: string;
  threadId?: string;
}

export interface ChatResponse {
  reply: string;
  threadId: string;
  messageId: string;
}
