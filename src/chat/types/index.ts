// Conversation turn represents a single message exchange
export interface ConversationTurn {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  blocks?: TurnBlock[];
  timestamp: Date;
}

// Block types for structured assistant responses
export type TurnBlockType =
  | 'text'
  | 'profile-basics-prompt'
  | 'role-prompt'
  | 'cv-upload-prompt'
  | 'confirmation';

export interface TurnBlock {
  id: string;
  type: TurnBlockType;
  data: Record<string, unknown>;
}

// Specific block data types
export interface TextBlockData {
  content: string;
}

export interface ProfileBasicsPromptData {
  fields: string[];
  existingData?: Record<string, string>;
}

export interface RolePromptData {
  roleIndex?: number;
  existingRole?: {
    title?: string;
    company?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
  };
}

export interface CVUploadPromptData {
  acceptedFormats: string[];
}

export interface ConfirmationData {
  action: string;
  details: Record<string, unknown>;
  confirmed: boolean;
}

// Conversation state
export interface ConversationState {
  turns: ConversationTurn[];
  isLoading: boolean;
  error?: string;
}
