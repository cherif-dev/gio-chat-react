import React from 'react';
import { MessageList, MessageListProps } from '../Message/MessageList';
import { MessageInput, MessageInputProps } from '../Message/MessageInput';
import { ChatHeader } from './ChatHeader';
import { useCurrentConversation } from '../../context';

/**
 * Chat window props
 */
export interface ChatWindowProps {
  contact_uuid: string;
  messageListProps: MessageListProps;
  messageInputProps: MessageInputProps;
  onBack?: () => void;
  showHeader?: boolean;
  className?: string;
  onSearchClick?: () => void;
  onVideoCallClick?: () => void;
  onPhoneCallClick?: () => void;
  onMenuClick?: () => void;
}

/**
 * Chat window component
 */
export const ChatWindow: React.FC<ChatWindowProps> = ({
  contact_uuid,
  messageListProps,
  messageInputProps,
  onBack,
  showHeader = true,
  className = '',
  onSearchClick,
  onVideoCallClick,
  onPhoneCallClick,
  onMenuClick,
}) => {
  const [conversation] = useCurrentConversation();
  if (!conversation) {
    return (
      <div className={`flex flex-col h-full bg-gradient-to-br from-slate-50 to-white ${className}`}>
        <div className="flex flex-col items-center justify-center h-full text-slate-400">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-600 mb-2">Welcome to Chat</h3>
          <p className="text-sm text-slate-400 text-center max-w-sm">
            Select a conversation from the sidebar to start chatting
          </p>
        </div>
      </div>
    );
  }

  const messageListPropsWithConversation = {
    ...messageListProps,
    conversation,
  };
  const messageInputPropsWithConversation = {
    ...messageInputProps,
    conversation,
    sender_uuid: contact_uuid,
  };
  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {showHeader && (
        <ChatHeader
          contact_uuid={contact_uuid}
          onBack={onBack}
          onSearchClick={onSearchClick}
          onVideoCallClick={onVideoCallClick}
          onPhoneCallClick={onPhoneCallClick}
          onMenuClick={onMenuClick}
        />
      )}

      <MessageList
        {...messageListPropsWithConversation}
        className="overflow-y-auto h-[calc(100vh-100px)] mb-4 pb-6"
      />

      <MessageInput {...messageInputPropsWithConversation} />
    </div>
  );
};
