import { useState, useCallback } from 'react';
import type {
  ConversationTurn,
  ConversationState,
  ConversationStep,
  UserInputAction,
} from '../types';
import { useMyProfileQuery } from '@/profile';

/**
 * Mock backend-first conversation driver
 * This simulates a backend-driven conversation flow for profile building
 * In production, this would be replaced by actual API calls to /agents/:id/chat
 */
export const useConversationDriver = () => {
  const { data: profile } = useMyProfileQuery();
  
  const [state, setState] = useState<ConversationState>({
    turns: [
      {
        id: '1',
        role: 'assistant',
        content: 'Welcome to Jura! 👋',
        blocks: [
          {
            id: 'welcome-1',
            type: 'text',
            data: {
              content:
                "I'm your AI career agent. I'll help you build a recruiter-ready profile that showcases your experience and achievements. Let's get started!",
            },
          },
          {
            id: 'welcome-2',
            type: 'cv-upload-prompt',
            data: {
              acceptedFormats: ['.pdf', '.doc', '.docx'],
            },
          },
        ],
        timestamp: new Date(),
      },
    ],
    isLoading: false,
    currentStep: 'welcome',
  });

  const getNextStep = useCallback(
    (currentStep: ConversationStep): ConversationStep => {
      if (currentStep === 'welcome') return 'cv-upload-or-manual';
      if (currentStep === 'cv-upload-or-manual') return 'basic-info';
      if (currentStep === 'basic-info') {
        // Check if we have basic info
        if (!profile?.basics.name || !profile?.basics.headline) {
          return 'basic-info';
        }
        return 'role-entry';
      }
      if (currentStep === 'role-entry') return 'role-details';
      if (currentStep === 'role-details') {
        // Check if we need more roles
        if (!profile?.roles || profile.roles.length === 0) {
          return 'role-entry';
        }
        return 'review';
      }
      if (currentStep === 'review') return 'complete';
      return 'complete';
    },
    [profile]
  );

  const generateAssistantResponse = useCallback(
    (step: ConversationStep, userMessage?: string): ConversationTurn => {
      const turnId = `turn-${Date.now()}`;

      switch (step) {
        case 'cv-upload-or-manual':
          return {
            id: turnId,
            role: 'assistant',
            content: 'Great! How would you like to proceed?',
            blocks: [
              {
                id: `${turnId}-text`,
                type: 'text',
                data: {
                  content:
                    'You can either upload your CV and I\'ll extract the information, or we can enter it manually together. What would you prefer?',
                },
              },
            ],
            timestamp: new Date(),
          };

        case 'basic-info':
          return {
            id: turnId,
            role: 'assistant',
            content: "Let's start with your basic information",
            blocks: [
              {
                id: `${turnId}-basics`,
                type: 'profile-basics-prompt',
                data: {
                  fields: ['name', 'headline', 'email', 'location'],
                  existingData: profile?.basics || {},
                },
              },
            ],
            timestamp: new Date(),
          };

        case 'role-entry':
          return {
            id: turnId,
            role: 'assistant',
            content: "Now, let's add your professional experience",
            blocks: [
              {
                id: `${turnId}-text`,
                type: 'text',
                data: {
                  content:
                    'Tell me about your most recent or current role. What was your job title and company?',
                },
              },
            ],
            timestamp: new Date(),
          };

        case 'role-details':
          return {
            id: turnId,
            role: 'assistant',
            content: 'Tell me more about this role',
            blocks: [
              {
                id: `${turnId}-role`,
                type: 'role-prompt',
                data: {
                  roleIndex: profile?.roles.length || 0,
                },
              },
            ],
            timestamp: new Date(),
          };

        case 'review':
          return {
            id: turnId,
            role: 'assistant',
            content: 'Great progress!',
            blocks: [
              {
                id: `${turnId}-text`,
                type: 'text',
                data: {
                  content: `Your profile is ${Math.round((profile?.completenessScore || 0) * 100)}% complete. You can review it on the right panel. Would you like to add another role or refine what we have?`,
                },
              },
            ],
            timestamp: new Date(),
          };

        case 'complete':
          return {
            id: turnId,
            role: 'assistant',
            content: 'Your profile is ready!',
            blocks: [
              {
                id: `${turnId}-text`,
                type: 'text',
                data: {
                  content:
                    '🎉 Your profile looks great! You can continue to refine it or start sharing it with recruiters.',
                },
              },
            ],
            timestamp: new Date(),
          };

        default:
          return {
            id: turnId,
            role: 'assistant',
            content: userMessage || 'I understand.',
            blocks: [
              {
                id: `${turnId}-text`,
                type: 'text',
                data: {
                  content: 'How else can I help you with your profile?',
                },
              },
            ],
            timestamp: new Date(),
          };
      }
    },
    [profile]
  );

  const handleUserInput = useCallback(
    (action: UserInputAction) => {
      setState((prev) => {
        const userTurn: ConversationTurn = {
          id: `user-${Date.now()}`,
          role: 'user',
          content:
            action.type === 'message'
              ? (action.payload as string)
              : `[${action.type}]`,
          timestamp: new Date(),
        };

        const nextStep = getNextStep(prev.currentStep);
        const assistantTurn = generateAssistantResponse(
          nextStep,
          userTurn.content
        );

        return {
          ...prev,
          turns: [...prev.turns, userTurn, assistantTurn],
          currentStep: nextStep,
        };
      });
    },
    [getNextStep, generateAssistantResponse]
  );

  const sendMessage = useCallback(
    (message: string) => {
      if (!message.trim()) return;

      handleUserInput({
        type: 'message',
        payload: message,
      });
    },
    [handleUserInput]
  );

  return {
    conversation: state,
    sendMessage,
    handleUserInput,
  };
};
