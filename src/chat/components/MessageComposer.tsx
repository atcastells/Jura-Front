import { useState, KeyboardEvent } from 'react';

interface MessageComposerProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const MessageComposer = ({
  onSendMessage,
  disabled = false,
  placeholder = 'Type your message...',
}: MessageComposerProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 rounded-lg border border-neutral-200 bg-white p-3">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="flex-1 resize-none border-none bg-transparent text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:ring-0"
        style={{ minHeight: '24px', maxHeight: '120px' }}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className="rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
        aria-label="Send message"
      >
        Send
      </button>
    </div>
  );
};
