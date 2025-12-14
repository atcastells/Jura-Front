// Centralized query keys following factory pattern
// Each feature adds its keys here for consistency

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

export const documentKeys = {
  all: ['documents'] as const,
  list: () => [...documentKeys.all, 'list'] as const,
  detail: (id: string) => [...documentKeys.all, 'detail', id] as const,
};

export const agentKeys = {
  all: ['agents'] as const,
  list: () => [...agentKeys.all, 'list'] as const,
  detail: (id: string) => [...agentKeys.all, 'detail', id] as const,
  threads: (agentId: string) => [...agentKeys.all, agentId, 'threads'] as const,
  thread: (agentId: string, threadId: string) =>
    [...agentKeys.all, agentId, 'threads', threadId] as const,
};

export const chatKeys = {
  all: ['chat'] as const,
  messages: (threadId: string) => [...chatKeys.all, 'messages', threadId] as const,
};
