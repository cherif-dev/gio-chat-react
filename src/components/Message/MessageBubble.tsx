import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../../types';
import { formatMessageTime } from '../../utils';
import { MessageActions } from './MessageActions';
import { cn } from '../../lib/utils';
import { MapImage } from '../../assets/map-image';
import MarkerIcon from '../../assets/marker.svg';
/**
 * Message bubble props
 */
export interface MessageBubbleProps {
  message: Message;
  isFromMe: boolean;
  senderName?: string;
  onDelete?: (messageId: number) => void;
  onEdit?: (messageId: number) => void;
  onReply?: (messageId: number) => void;
  className?: string;
}

/**
 * Message bubble component
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isFromMe,
  className = '',
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const content = message.content || message.body || '';
  const timestamp = formatMessageTime(message.sent_at);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check if content contains a URL
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Check if message has image data
  const hasImage = message.type === 'image' || (message.data && message.data.image_url);
  const imageUrl = message.data?.image_url;

  // Check if message has location data
  const hasLocation = message.type === 'location' && message.data;
  const locationData = hasLocation ? message.data : null;

  const senderName = message.sender.display_name_with_fallback;
  const avatarUrl = message.sender.avatar;
  const showAvatar = !isFromMe;
  // Render content with clickable links
  const renderContent = () => {
    const parts = content.split(urlRegex);
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 underline break-all"
          >
            {part}
          </a>
        );
      }
      return (
        <div
          key={index}
          className={cn(
            'py-2.5 rounded-md',
            isFromMe
              ? 'bg-gray-50 text-gray-800 border border-gray-50 pl-6 pr-2'
              : 'bg-gray-100 border border-gray-50 text-gray-800 pl-2 pr-6'
          )}
        >
          <span key={index}>{part}</span>
        </div>
      );
    });
  };

  // Render location card
  const renderLocationCard = () => {
    if (!locationData) return null;

    const { latitude, longitude } = locationData;
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    return (
      <div
        className={cn(
          'flex  rounded-2xl overflow-hidden max-w-sm bg-white border border-gray-200 shadow-none'
        )}
      >
        {/* Map Preview Image */}
        <div className="relative w-full h-28 ">
          <MapImage />
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-10 h-10">
            <MarkerIcon className="w-10 h-10" />
          </div>
        </div>

        {/* Location Info */}
        <div className="p-4 bg-white">
          <div className="flex flex-col items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-1">Location</p>
              <p className="text-sm text-gray-900 font-medium truncate">
                {latitude?.toFixed(6)}, {longitude?.toFixed(6)}
              </p>
            </div>

            {/* View on Map Button */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in Google Maps"
              className="flex items-center gap-2"
            >
              <svg
                className="w-5 h-5 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <span className="text-black text-sm">View on Map</span>
            </a>
          </div>
        </div>
      </div>
    );
  };

  const renderMessageContent = () => {
    if (hasLocation) {
      return renderLocationCard();
    }
    return renderContent();
  };

  return (
    <div className={`flex w-full ${isFromMe ? 'justify-end' : 'justify-start'} ${className}`}>
      <div className="flex gap-2 items-start group" style={{ maxWidth: '70%' }}>
        {/* Avatar */}
        {showAvatar && !isFromMe && (
          <div className="flex-shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={senderName || 'User'}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-medium text-sm">
                {senderName?.[0]?.toUpperCase() || '?'}
              </div>
            )}
          </div>
        )}

        {/* Message Content */}
        <div className={`flex flex-col  ${isFromMe ? 'items-end' : 'items-start'}`}>
          {/* Sender Name */}
          {!isFromMe && senderName && (
            <div className="text-sm font-medium text-gray-700 mb-1 px-1">{senderName}</div>
          )}

          <div className="flex gap-2 items-start group relative">
            {/* Message Bubble */}
            <div className={`flex flex-col gap-2 ${isFromMe ? 'items-end' : 'items-start'}`}>
              {/* Image */}
              {hasImage && imageUrl && (
                <div className="rounded-2xl overflow-hidden max-w-md">
                  <img src={imageUrl} alt="Attachment" className="w-full h-auto" />
                </div>
              )}
              {renderMessageContent()}
            </div>

            {/* Actions */}
            <MessageActions
              isFromMe={isFromMe}
              classNames={`${showDropdown ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-all duration-300 ${
                isFromMe
                  ? `absolute left-1 ${showDropdown ? 'translate-x-0' : '-translate-x-2 group-hover:translate-x-0'}`
                  : `absolute right-1 ${showDropdown ? 'translate-x-0' : 'translate-x-2 group-hover:translate-x-0'}`
              } top-3`}
              onDropdownOpen={() => setShowDropdown(true)}
              onDropdownClose={() => setShowDropdown(false)}
            />
          </div>

          {/* Timestamp and Status */}
          <div
            className={`flex items-center gap-1 mt-1 px-1 text-xs text-gray-500 ${isFromMe ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <span>{timestamp}</span>
            {isFromMe && (
              <span className="flex items-center">
                {message.status === 'read' && (
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                  </svg>
                )}
                {message.status === 'delivered' && (
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                  </svg>
                )}
                {message.status === 'sent' && (
                  <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                )}
                {message.status === 'failed' && (
                  <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
