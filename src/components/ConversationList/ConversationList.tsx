import React, { useState } from 'react';
import { Conversation, Contact } from '../../types';
import { formatConversationTime, getContactDisplayName, truncateText } from '../../utils';
import { useRealtimeMessages } from '../../hooks';

/**
 * Conversation list item props
 */
export interface ConversationListItemProps {
  conversation: Conversation;
  contact?: Contact;
  isActive?: boolean;
  onClick?: (conversation: Conversation) => void;
}

/**
 * Get status indicator color based on conversation status
 */
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'resolved':
    case 'closed':
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
  }
};

/**
 * Conversation list item component
 */
export const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  contact,
  isActive = false,
  onClick,
}) => {
  const displayName = contact ? getContactDisplayName(contact) : 'Unknown';
  const avatarUrl = contact?.avatar;
  const [lastMessage, setLastMessage] = useState(
    conversation.last_message?.content || 'No messages yet'
  );
  const [timestamp, setTimestamp] = useState(
    formatConversationTime(conversation.last_message?.sent_at || null)
  );
  const unreadCount = 0; // This should come from your data
  useRealtimeMessages(conversation.id, 'conversations-list', (event: any) => {
    if (event.type === 'message:created') {
      setLastMessage(event.payload.content || event.payload.body || 'No messages yet');
      setTimestamp(formatConversationTime(event.payload.sent_at || null));
    }
  });
  return (
    <div
      className={`flex items-center gap-4 px-4 py-4 cursor-pointer transition-all duration-200 ${
        isActive ? 'bg-blue-50 border-r-2 border-blue-500' : 'hover:bg-slate-50 hover:shadow-sm'
      }`}
      onClick={() => onClick?.(conversation)}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-semibold text-lg ring-2 ring-slate-100">
            {displayName[0]}
          </div>
        )}
        {contact?.is_online && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-slate-900 text-base truncate">{displayName}</h3>
          <span className="text-xs text-slate-500 flex-shrink-0 ml-2 font-medium">{timestamp}</span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600 truncate leading-5 flex-1">
            {truncateText(lastMessage, 50)}
          </p>
          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
            {unreadCount > 0 && (
              <span className="bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-full min-w-[20px] text-center shadow-sm">
                {unreadCount}
              </span>
            )}
            <div
              className={`w-2.5 h-2.5 rounded-full ${getStatusColor(conversation.status)} shadow-sm`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Tab type for conversation filtering
 */
export type ConversationTab = 'new' | 'in_progress' | 'on_hold' | 'completed';

/**
 * Conversation list props
 */
export interface ConversationListProps {
  conversations: Conversation[];
  contact_uuid: string;
  activeConversationId?: number | null;
  loading?: boolean;
  onConversationClick?: (conversation: Conversation, participant_uuid: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  className?: string;
  onSearch?: (query: string) => void;
  onTabChange?: (tab: ConversationTab) => void;
  activeTab?: ConversationTab;
}

/**
 * Conversation list component
 */
export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  contact_uuid,
  activeConversationId,
  loading = false,
  onConversationClick,
  onLoadMore,
  hasMore = false,
  className = '',
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const searchButton = () => {
    return (
      <button
        className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200 hover:scale-105"
        onClick={() => setIsSearchOpen(true)}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    );
  };

  const closeSearchButton = () => {
    return (
      <button
        className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200 hover:scale-105"
        onClick={() => setIsSearchOpen(false)}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    );
  };

  const handleConversationClick = (conversation: Conversation) => {
    const participant_uuid =
      conversation.first_participant?.uuid !== contact_uuid
        ? conversation.first_participant?.uuid
        : conversation.second_participant?.uuid;
    onConversationClick?.(conversation, participant_uuid!);
  };

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      <div className="relative">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <h3 className="text-xl font-bold text-slate-800">Conversations</h3>
          {isSearchOpen && (
            <div className="flex items-center gap-3 p-4 mx-2 absolute left-0 right-6 top-0 z-10 bg-white rounded-lg shadow-lg border border-slate-200">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 p-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-0 rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 shadow-sm"
                />
              </div>
            </div>
          )}
          {!isSearchOpen ? searchButton() : closeSearchButton()}
        </div>
        {/* Search Header */}
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {loading && conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-slate-400 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <div className="text-slate-500 text-sm font-medium">Loading conversations...</div>
          </div>
        )}

        {conversations.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-16">
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
            <div className="text-slate-500 text-sm font-medium">No conversations yet</div>
            <div className="text-slate-400 text-xs mt-1">
              Start a new conversation to get started
            </div>
          </div>
        )}

        {conversations.map(conversation => {
          const contact =
            conversation.first_participant?.uuid !== contact_uuid
              ? conversation.first_participant
              : conversation.second_participant;
          return (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              contact={contact}
              isActive={conversation.id === activeConversationId}
              onClick={handleConversationClick}
            />
          );
        })}

        {hasMore && (
          <div className="p-4">
            <button
              onClick={onLoadMore}
              disabled={loading}
              className="w-full py-3 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-sm"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Loading...</span>
                </div>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
