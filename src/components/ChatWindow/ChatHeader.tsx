import React, { useMemo } from 'react';
import { cn } from '../../lib/utils';
import { useCurrentConversation } from '../../context';
import { getContactDisplayName } from '../../utils';

export interface ChatHeaderProps {
  contact_uuid: string;
  onBack?: () => void;
  onSearchClick?: () => void;
  onVideoCallClick?: () => void;
  onPhoneCallClick?: () => void;
  onMenuClick?: () => void;
  className?: string;
}

/**
 * Reusable chat header component with contact info and action buttons
 */
export const ChatHeader: React.FC<ChatHeaderProps> = ({
  contact_uuid,
  onBack,
  onSearchClick,
  onVideoCallClick,
  onPhoneCallClick,
  onMenuClick,
  className,
}) => {
  const [conversation] = useCurrentConversation();

  const contact = useMemo(() => {
    return conversation?.first_participant?.uuid !== contact_uuid
      ? conversation?.first_participant
      : conversation?.second_participant;
  }, [conversation, contact_uuid]);

  const displayName = useMemo(() => {
    return contact ? getContactDisplayName(contact) : 'Unknown';
  }, [contact]);

  const avatarUrl = useMemo(() => {
    return contact?.avatar;
  }, [contact]);

  const isOnline = useMemo(() => {
    return contact?.is_online;
  }, [contact]);
  return (
    <div
      className={cn(
        'flex items-center px-6 py-4 bg-white border-b border-slate-200 shadow-none backdrop-blur-sm',
        className
      )}
    >
      {onBack && (
        <button
          className="flex items-center justify-center w-10 h-10 mr-4 text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200 hover:scale-105"
          onClick={onBack}
          aria-label="Go back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Avatar and Contact Info */}
      <div className="flex items-center flex-1 min-w-0">
        <div className="relative flex-shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
            />
          ) : (
            <div className="flex items-center justify-center w-12 h-12 rounded-full  bg-blue-500 text-white font-semibold text-lg ring-2 ring-slate-100">
              {displayName[0]?.toUpperCase()}
            </div>
          )}
          {isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full">
              d
            </div>
          )}
        </div>

        <div className="ml-4 flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-slate-900 truncate">{displayName}</h2>
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                'text-xs text-white rounded-full w-2 h-2',
                isOnline ? 'bg-green-500' : 'bg-red-500'
              )}
            ></div>
            <p className="text-sm text-slate-500">{isOnline ? 'Active now' : 'Offline'}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 ml-4">
        {onSearchClick && (
          <button
            className="flex items-center justify-center w-10 h-10 text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200 hover:scale-105"
            onClick={onSearchClick}
            aria-label="Search"
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
        )}

        {onVideoCallClick && (
          <button
            className="flex items-center justify-center w-10 h-10 text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200 hover:scale-105"
            onClick={onVideoCallClick}
            aria-label="Video call"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        )}

        {onPhoneCallClick && (
          <button
            className="flex items-center justify-center w-10 h-10 text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200 hover:scale-105"
            onClick={onPhoneCallClick}
            aria-label="Phone call"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </button>
        )}

        {onMenuClick && (
          <button
            className="flex items-center justify-center w-10 h-10 text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200 hover:scale-105"
            onClick={onMenuClick}
            aria-label="More options"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
