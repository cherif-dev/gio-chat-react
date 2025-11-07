import React, { useState, useEffect } from 'react';
import { ConversationList } from '../ConversationList/ConversationList';
import { ChatWindow } from './ChatWindow';
import { useContacts } from '../../hooks/useContacts';
import { useConversations } from '../../hooks/useConversations';
import { useConversation } from '../../hooks/useConversation';
import { useMessages } from '../../hooks/useMessages';
import {
  useRealtimeMessages,
  useRealtimeContactConversations,
  useRealtimeContactStatus,
  useTypingIndicator,
} from '../../hooks/useRealtime';
import { Contact, Conversation, CreateMessageRequest } from '../../types';
import { cn } from '../../lib/utils';
import { useChatContext } from '../../context';
import { CustomAttachmentButton } from '../Message/MessageInput';

export interface ChatViewProps {
  contact_uuid: string;
  participant_uuid: string;
  hide_conversation_list?: boolean;
  className?: string;
  customAttachmentButtons?: CustomAttachmentButton[];
}

// App with Provider
export const ChatView: React.FC<ChatViewProps> = ({
  contact_uuid,
  participant_uuid,
  hide_conversation_list = false,
  className,
  customAttachmentButtons = [],
}) => {
  const contact_id = contact_uuid;
  const [participant_id, setParticipant_id] = useState<string | null>(participant_uuid || null);
  const [typingUsers, setTypingUsers] = useState<Record<number, boolean>>({});
  // Fetch contacts
  const { contacts: contactsList, refresh: refreshContacts } = useContacts({
    is_active: true,
  });

  // Create contacts map for quick lookup
  const contactsMap = React.useMemo(() => {
    const map: Record<number, Contact> = {};
    contactsList.forEach((contact: Contact) => {
      map[contact.id] = contact;
    });
    return map;
  }, [contactsList]);
  // Main Chat Application Component
  // Fetch conversations
  const {
    conversations,
    loading: conversationsLoading,
    refresh: refreshConversations,
  } = useConversations(contact_id, {
    status: 'active',
  });
  const { initialize } = useChatContext();
  initialize();
  // Get current conversation
  const { conversation, loading: conversationLoading } = useConversation(
    contact_id,
    participant_id
  );

  // Get messages for current conversation
  const {
    messages,
    sendMessage,
    deleteMessage,
    markAsRead,
    loading: messagesLoading,
    hasMore,
    loadMore,
  } = useMessages();

  // Typing indicator
  const { startTyping, stopTyping, subscribeToTyping } = useTypingIndicator(
    conversation?.id || null,
    1
  );

  // Subscribe to real-time message updates
  useRealtimeMessages(conversation?.id || null, 'chat', (event: any) => {
    if (event.type === 'message:created') {
      // Auto-mark as read if conversation is active
      if (event.payload.id && !event.payload.from_me) {
        markAsRead(event.payload.id);
      }
    }
  });

  // Subscribe to conversation updates
  useRealtimeContactConversations(conversation?.id || null, (event: any) => {
    if (event.type === 'conversation:created' || event.type === 'conversation:updated') {
      /*   refreshConversations();*/
    }
  });

  // Subscribe to contact status updates
  useRealtimeContactStatus(conversation?.id || null, (event: any) => {
    console.log(event);
    refreshContacts();
  });

  // Subscribe to typing indicators
  useEffect(() => {
    if (conversation?.id) {
      subscribeToTyping((event: any) => {
        const typingEvent = event.payload;
        setTypingUsers(prev => ({
          ...prev,
          [typingEvent.contact_id]: typingEvent.is_typing,
        }));
      });
    }
  }, [conversation?.id, subscribeToTyping]);

  // Handle message send
  const handleSendMessage = async (data: any) => {
    stopTyping();
    return sendMessage(data);
  };

  return (
    <div className={cn('flex bg-gradient-to-br from-slate-50 to-slate-100', className)}>
      {/* Conversations Sidebar */}
      {!hide_conversation_list && (
        <div className="w-80 bg-white border-r border-slate-200 shadow-sm flex flex-col">
          <ConversationList
            conversations={conversations}
            contact_uuid={contact_id!}
            activeConversationId={conversation?.id}
            loading={conversationsLoading}
            onConversationClick={(conv: Conversation, participant_uuid: string) => {
              setParticipant_id(participant_uuid);
            }}
          />
        </div>
      )}

      {/* Chat Window */}
      <div className="flex-1 flex flex-col relative">
        <ChatWindow
          contact_uuid={contact_id || ''}
          messageListProps={{
            conversation: conversation!,
            sender_uuid: contact_id,
            messages,
            contacts: contactsMap,
            loading: messagesLoading,
            onMessageDelete: deleteMessage,
            hasMore,
            onLoadMore: loadMore,
          }}
          messageInputProps={{
            conversation: conversation as Conversation,
            sender_uuid: contact_id,
            onSend: async (message: CreateMessageRequest) => {
              await handleSendMessage(message);
            },
            onTyping: startTyping,
            onStopTyping: stopTyping,
            placeholder: 'Type a message...',
            customAttachmentButtons: customAttachmentButtons,
          }}
        />

        {/* Typing indicator */}
        {Object.values(typingUsers).some(typing => typing) && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-pulse">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                ></div>
                <div
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                ></div>
                <div
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                ></div>
              </div>
              <span>Someone is typing...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
