import React, { useState, useRef, useCallback, useEffect, KeyboardEvent } from 'react';
import { Conversation, CreateMessageRequest } from '../../types';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { PlusIcon, ImageIcon, FileTextIcon, CameraIcon, MapPinIcon } from 'lucide-react';
export interface CustomMessage {
  content: string;
  type: any;
  data: Record<string, any>;
}
export interface CustomAttachmentButton {
  label: string;
  icon: React.ReactNode;
  handler: () => CustomMessage | null;
}

/**
 * Message input props
 */
export interface MessageInputProps {
  conversation: Conversation;
  sender_uuid: string | null;
  onSend: (message: CreateMessageRequest) => Promise<void>;
  onTyping?: () => void;
  onStopTyping?: () => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  showAttachment?: boolean;
  showEmoji?: boolean;
  showVoice?: boolean;
  showLocation?: boolean;
  className?: string;
  customAttachmentButtons?: CustomAttachmentButton[];
}

/**
 * Message input component with modern Tailwind CSS design
 */
export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onTyping,
  onStopTyping,
  placeholder = 'Type a message',
  disabled = false,
  maxLength = 10000,
  showAttachment = true,
  showEmoji = true,
  showVoice = true,
  showLocation = false,
  className = '',
  conversation,
  sender_uuid = '',
  customAttachmentButtons = [],
}) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [cameraSupported, setCameraSupported] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sender =
    conversation?.first_participant?.uuid === sender_uuid
      ? conversation?.first_participant
      : conversation?.second_participant;
  const senderId = sender?.id;

  // Check camera support on mount
  useEffect(() => {
    const checkCameraSupport = async () => {
      try {
        // Check if mediaDevices API is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setCameraSupported(false);
          return;
        }

        // Check if we can enumerate devices and find a camera
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some(device => device.kind === 'videoinput');
        setCameraSupported(hasCamera);
      } catch (error) {
        console.error('Error checking camera support:', error);
        setCameraSupported(false);
      }
    };

    checkCameraSupport();
  }, []);

  const handleTyping = useCallback(() => {
    if (onTyping) {
      onTyping();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (onStopTyping) {
        onStopTyping();
      }
    }, 3000);
  }, [onTyping, onStopTyping]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    if (value.length <= maxLength) {
      setMessage(value);
      handleTyping();
    }

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };
  const handleSaveMessageToLocalStorage = (
    messageData: CreateMessageRequest & { error?: unknown }
  ) => {
    const messages = handleGetMessageFromLocalStorage();
    messages.push(messageData);

    localStorage.setItem('genit:chat:messages', JSON.stringify(messageData));
  };
  const handleGetMessageFromLocalStorage = () => {
    const messageData = localStorage.getItem('genit:chat:messages');
    return messageData ? JSON.parse(messageData) : [];
  };
  const handleSend = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || sending || disabled) return;
    const messageData: CreateMessageRequest = {
      sender_uuid: sender!.uuid!,
      content: trimmedMessage,
      type: 'text',
      from_me: true,
      sender: sender!,
    };
    try {
      setSending(true);
      await onSend(messageData);

      setMessage('');

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      // Stop typing indicator
      if (onStopTyping) {
        onStopTyping();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // save the message to local storage
      handleSaveMessageToLocalStorage({ ...messageData, error: error });
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageAttachment = () => {
    // Create file input for images
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = e => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        console.log('Selected images:', files);
        // Handle image upload logic here
      }
    };
    input.click();
  };

  const handleDocumentAttachment = () => {
    // Create file input for documents
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.txt,.rtf,.odt';
    input.multiple = true;
    input.onchange = e => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        console.log('Selected documents:', files);
        // Handle document upload logic here
      }
    };
    input.click();
  };

  const handleCameraCapture = async () => {
    if (!cameraSupported) {
      console.error('Camera is not supported on this device');
      // You could show a toast notification here
      return;
    }

    try {
      // Check for permissions first
      if (navigator.permissions) {
        const permissionStatus = await navigator.permissions.query({
          name: 'camera' as PermissionName,
        });

        if (permissionStatus.state === 'denied') {
          console.error('Camera permission denied');
          // You could show a toast notification here
          return;
        }
      }

      // Create file input for camera capture
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // Use back camera if available

      input.onchange = e => {
        const files = (e.target as HTMLInputElement).files;
        if (files && files.length > 0) {
          console.log('Captured image:', files);
          // Handle camera capture logic here
          // You can process the file and send it as a message
          // Example: Create a message with image type
          const file = files[0];
          console.log('Image file:', {
            name: file.name,
            type: file.type,
            size: file.size,
          });

          // TODO: Implement image upload and message sending
          // const imageUrl = await uploadImage(file);
          // await onSend({
          //   sender_id: senderId!,
          //   content: 'Sent an image',
          //   type: 'image',
          //   from_me: true,
          //   sender: sender!,
          //   data: { image_url: imageUrl }
          // });
        }
      };

      input.click();
    } catch (error) {
      console.error('Error accessing camera:', error);
      // Fallback to simple file input if camera access fails
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = e => {
        const files = (e.target as HTMLInputElement).files;
        if (files) {
          console.log('Selected image:', files);
        }
      };
      input.click();
    }
  };

  const handleLocationShare = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return;
    }

    // Show loading state (you could add a loading indicator here)
    console.log('Getting current location...');

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude, accuracy } = position.coords;
        const locationData = {
          latitude,
          longitude,
          accuracy,
          timestamp: new Date().toISOString(),
        };

        console.log('Location obtained:', locationData);

        // Create a location message
        const locationMessage: CreateMessageRequest = {
          sender_uuid: sender!.uuid!,
          content: `📍 My current location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          type: 'location',
          from_me: true,
          sender: sender!,
          data: locationData,
        };

        // Send the location message
        onSend(locationMessage).catch(error => {
          console.error('Error sending location:', error);
          // Save to local storage on error
          handleSaveMessageToLocalStorage({ ...locationMessage, error });
        });
      },
      error => {
        console.error('Error getting location:', error);
        let errorMessage = 'Unable to get your location.';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }

        console.error(errorMessage);
        // You could show a toast notification here
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const handleEmoji = () => {
    // Placeholder for emoji picker functionality
    console.log('Emoji clicked');
  };

  const handleVoice = () => {
    // Placeholder for voice recording functionality
    console.log('Voice clicked');
  };

  const handleLocation = () => {
    // Placeholder for location sharing functionality
    console.log('Location clicked');
  };

  return (
    <div className={`bg-white border-t border-gray-200 ${className}`}>
      <div className="px-4 py-3">
        {/* Main input container */}
        <div className="flex items-end gap-2 bg-gray-50 rounded-3xl px-4 py-2.5 border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
          {/* Voice button */}
          {showVoice && (
            <button
              onClick={handleVoice}
              disabled={disabled}
              className="flex-shrink-0 p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Voice message"
              aria-label="Voice message"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}

          {/* Text input */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || sending}
            rows={1}
            maxLength={maxLength}
            className="flex-1 bg-transparent border-none outline-none resize-none text-gray-800 placeholder-gray-400 text-sm max-h-32 disabled:opacity-50 disabled:cursor-not-allowed py-1"
            style={{ minHeight: '24px' }}
          />

          {/* Action buttons container */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Attachment dropdown */}
            {showAttachment && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    disabled={disabled}
                    variant="ghost"
                    size="icon"
                    title="Attach file"
                    aria-label="Attach file"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end">
                  <DropdownMenuItem onClick={handleImageAttachment}>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Photos & Videos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDocumentAttachment}>
                    <FileTextIcon className="h-4 w-4 mr-2" />
                    Documents
                  </DropdownMenuItem>
                  {cameraSupported && (
                    <DropdownMenuItem onClick={handleCameraCapture}>
                      <CameraIcon className="h-4 w-4 mr-2" />
                      Camera
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLocationShare}>
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    Share location
                  </DropdownMenuItem>

                  {customAttachmentButtons.length > 0 && <DropdownMenuSeparator />}
                  {customAttachmentButtons.map((button, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => {
                        const messageData = button.handler();
                        if (messageData) {
                          const message: CreateMessageRequest = {
                            sender_uuid: sender!.uuid!,
                            ...messageData,
                            sender: sender!,
                          };
                          onSend(message);
                        }
                      }}
                    >
                      {button.icon}
                      {button.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Emoji button */}
            {showEmoji && (
              <button
                onClick={handleEmoji}
                disabled={disabled}
                className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Add emoji"
                aria-label="Add emoji"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!message.trim() || disabled || sending}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              title="Send message"
              aria-label="Send message"
            >
              {sending ? (
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              )}
            </button>

            {/* Location button */}
            {showLocation && (
              <button
                onClick={handleLocation}
                disabled={disabled}
                className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Share location"
                aria-label="Share location"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Character count */}
        {message.length > maxLength * 0.8 && (
          <div className="flex justify-end mt-1.5 px-2">
            <span
              className={`text-xs ${
                message.length >= maxLength ? 'text-red-500 font-medium' : 'text-gray-400'
              }`}
            >
              {message.length} / {maxLength}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
