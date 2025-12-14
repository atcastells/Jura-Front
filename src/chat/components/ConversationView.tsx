import { useEffect, useRef } from 'react';
import type { ConversationTurn } from '../types';
import { TurnBlockRenderer } from './TurnBlockRenderer';
import { MessageComposer } from './MessageComposer';
import { useConversationDriver } from '../hooks';

export const ConversationView = () => {
  const { conversation, sendMessage } = useConversationDriver();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.turns]);

  const renderTurn = (turn: ConversationTurn) => {
    const isUser = turn.role === 'user';

    return (
      <div
        key={turn.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-[85%] ${isUser ? 'ml-auto' : 'mr-auto'}`}>
          {/* Turn header */}
          <div className={`mb-1 flex items-center gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white text-xs font-bold">
                J
              </div>
            )}
            <span className="text-xs text-neutral-500">
              {isUser ? 'You' : 'Jura'}
            </span>
            <span className="text-xs text-neutral-400">
              {turn.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {/* Turn content */}
          {isUser ? (
            <div className="rounded-lg bg-primary-500 px-4 py-3 text-sm text-white">
              {turn.content}
            </div>
          ) : (
            <div className="space-y-3">
              {turn.blocks && turn.blocks.length > 0 ? (
                turn.blocks.map((block) => (
                  <TurnBlockRenderer key={block.id} block={block} />
                ))
              ) : (
                <div className="rounded-lg bg-neutral-100 px-4 py-3 text-sm text-neutral-700">
                  {turn.content}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col rounded-lg border border-neutral-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-white font-bold">
            J
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              Jura - Your AI Career Agent
            </h2>
            <p className="text-xs text-neutral-500">
              Building your recruiter-ready profile
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
            Step: {conversation.currentStep}
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {conversation.turns.map((turn) => renderTurn(turn))}
        {conversation.isLoading && (
          <div className="flex justify-start mb-4">
            <div className="flex items-center gap-2 rounded-lg bg-neutral-100 px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary-500" style={{ animationDelay: '0ms' }}></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary-500" style={{ animationDelay: '150ms' }}></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary-500" style={{ animationDelay: '300ms' }}></span>
              </div>
              <span className="text-xs text-neutral-600">Jura is typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <div className="border-t border-neutral-200 p-4">
        <MessageComposer
          onSendMessage={sendMessage}
          disabled={conversation.isLoading}
          placeholder="Type your response or ask a question..."
        />
      </div>
    </div>
  );
};
