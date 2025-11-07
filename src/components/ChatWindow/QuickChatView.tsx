import React, { useState, useEffect } from 'react';
import { useContacts } from '../../hooks/useContacts';
import { useMessages } from '../../hooks/useMessages';
import {
  useRealtimeMessages,
  useRealtimeContactConversations,
  useRealtimeContactStatus,
  useTypingIndicator,
} from '../../hooks/useRealtime';
import { Contact, Conversation, CreateMessageRequest } from '../../types';

import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { useConversation } from '../../hooks';
import { Loader2, MessageCircleIcon } from 'lucide-react';
import { ProjectConfig } from '../../types';
import { CustomAttachmentButton, MessageInput } from '../Message/MessageInput';
import { MessageList } from '../Message/MessageList';
import { ChatHeader } from './ChatHeader';
import { useChatContext, useProjectConfig } from '../../context';

interface QuickChatViewProps {
  /** The configuration for the chat service */
  config: ProjectConfig;
  /** The current user's contact UUID */
  contact_uuid: string;
  /** The participant's contact UUID */
  participant_uuid: string;
  /** Custom trigger button */
  trigger?: React.ReactNode;
  /** Button variant for the default trigger */
  triggerVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  /** Button size for the default trigger */
  triggerSize?: 'default' | 'sm' | 'lg' | 'icon';
  /** Custom title for the sheet */
  title?: string;
  /** Custom description for the sheet */
  description?: string;
  /** Whether to show the sheet by default */
  open?: boolean;
  /** Callback when sheet open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Custom attachment buttons */
  customAttachmentButtons?: CustomAttachmentButton[];
}

export function QuickChatView({
  contact_uuid,
  participant_uuid,
  trigger,
  triggerVariant = 'outline',
  triggerSize = 'default',
  open,
  onOpenChange,
  customAttachmentButtons = [],
}: QuickChatViewProps) {
  // Generate title and description
  const contact_id = contact_uuid;
  const [participant_id, setParticipant_id] = useState<string | null>(participant_uuid || null);
  const [typingUsers, setTypingUsers] = useState<Record<number, boolean>>({});
  // Fetch contacts
  const { contacts: contactsList, refresh: refreshContacts } = useContacts({
    is_active: true,
  });
  const { initialize } = useChatContext();
  initialize();
  // Create contacts map for quick lookup
  const contactsMap = React.useMemo(() => {
    const map: Record<number, Contact> = {};
    contactsList.forEach((contact: Contact) => {
      map[contact.id] = contact;
    });
    return map;
  }, [contactsList]);
  // Main Chat Application Component

  // Get current conversation
  const { conversation, loading: conversationLoading } = useConversation(
    contact_id,
    participant_id
  );
  const sheetTitle = conversation?.title || '';
  const sheetDescription = conversation?.description || '';

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
  const handleSendMessage = async (data: CreateMessageRequest) => {
    stopTyping();
    return sendMessage(data);
  };
  // Default trigger button
  const defaultTrigger = (
    <Button variant={triggerVariant} size={triggerSize}>
      <MessageCircleIcon className="w-4 h-4" />
      {triggerSize !== 'icon' && <span>Chat</span>}
    </Button>
  );

  // Don't render if no current user
  if (!contact_uuid || !participant_uuid) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{trigger || defaultTrigger}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg p-0">
        <SheetHeader className="hidden">
          <SheetTitle>{sheetTitle}</SheetTitle>
          <SheetDescription>{sheetDescription}</SheetDescription>
        </SheetHeader>
        <ChatHeader contact_uuid={contact_uuid} className="absolute top-0 left-0 right-0 z-50" />
        <div className="flex-1   mb-[200px]">
          {conversationLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : (
            <MessageList
              className="overflow-y-auto h-[calc(100vh-100px)] mb-4 pt-8 pb-6"
              conversation={conversation!}
              sender_uuid={contact_id}
              messages={messages}
              contacts={contactsMap}
              loading={messagesLoading}
              onMessageDelete={deleteMessage}
              hasMore={hasMore}
              onLoadMore={loadMore}
            />
          )}

          <MessageInput
            className="absolute bottom-0 left-0 right-0"
            conversation={conversation as Conversation}
            sender_uuid={contact_id}
            onSend={async (message: CreateMessageRequest) => {
              await handleSendMessage(message);
            }}
            onTyping={startTyping}
            onStopTyping={stopTyping}
            placeholder="Type a message..."
            customAttachmentButtons={customAttachmentButtons}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
