import React, { useEffect, useRef } from 'react';
import { Message, Contact, RealtimeEvent, Conversation } from '../../types';
import { MessageBubble } from './MessageBubble';
import { groupMessagesByDate, formatDateTime } from '../../utils';
import { useRealtimeMessages } from '../../hooks';
import { useCurrentConversation } from '../../context';
/**
 * Message list props
 */
export interface MessageListProps {
  conversation: Conversation;
  messages: Message[];
  sender_uuid: string | null;
  contacts?: Record<number, Contact>;
  loading?: boolean;
  onLoadMore?: () => void;
  onMessageDelete?: (messageId: number) => void;
  onMessageEdit?: (messageId: number) => void;
  hasMore?: boolean;
  className?: string;
}

/**
 * Message list component
 */
export const MessageList: React.FC<MessageListProps> = ({
  messages,
  sender_uuid,
  loading = false,
  onLoadMore,
  onMessageDelete,
  onMessageEdit,
  hasMore = false,
  className = '',
}) => {
  const [conversation] = useCurrentConversation();
  const messageListRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages);
  const dates = Object.keys(groupedMessages).sort();

  // Scroll to bottom function
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messageListRef.current) {
      messageListRef.current.scrollTo({ top: messageListRef.current.scrollHeight + 500, behavior });
    }
  };

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (!onLoadMore || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry.isIntersecting && !loading && hasMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (topSentinelRef.current) {
      observerRef.current.observe(topSentinelRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [onLoadMore, loading, hasMore]);

  useRealtimeMessages(
    conversation?.id || null,
    'messages-list',
    (event: RealtimeEvent<Message>) => {
      switch (event.type) {
        case 'message:created':
          // Small delay to ensure DOM is updated
          setTimeout(() => scrollToBottom('smooth'), 100);
          break;
      }
    }
  );

  useEffect(() => {
    console.log('loading', loading);
    if (!loading) {
      setTimeout(() => scrollToBottom('instant'), 0);
    }
  }, [loading]);
  return (
    <div className={`flex flex-col bg-white ${className} `} ref={messageListRef}>
      {hasMore && <div ref={topSentinelRef} className="h-2" />}

      {loading && messages.length === 0 && (
        <div className="flex items-center justify-center h-screen text-gray-500">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            <span>Loading messages...</span>
          </div>
        </div>
      )}

      {messages.length === 0 && !loading && (
        <div className="flex items-center justify-center  text-gray-400 text-center px-4 h-screen">
          <div className="flex flex-col items-center gap-2">
            <svg
              className="w-16 h-16 text-gray-300"
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
            <span>No messages yet. Start the conversation!</span>
          </div>
        </div>
      )}

      <div className="px-4 py-6 space-y-6">
        {dates.map(date => (
          <div key={date} className="space-y-4">
            {/* Date Separator */}
            <div className="flex justify-center">
              <div className="px-4 py-1 text-xs text-gray-500 bg-gray-50 rounded-full">
                {formatDateTime(date)}
              </div>
            </div>

            {/* Messages */}
            <div className="space-y-4">
              {groupedMessages[date].map(message => {
                const isFromMe = message?.sender?.uuid === sender_uuid;
                console.log({ message: message, sender_uuid });
                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isFromMe={isFromMe}
                    onDelete={onMessageDelete}
                    onEdit={onMessageEdit}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {loading && messages.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            <span>Loading more...</span>
          </div>
        </div>
      )}
    </div>
  );
};
