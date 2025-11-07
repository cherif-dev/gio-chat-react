/**
 * Advanced Usage Example
 *
 * This example demonstrates advanced features including:
 * - Multiple conversations
 * - Real-time updates
 * - Typing indicators
 * - Online status
 * - Custom styling
 */

import React, { useState, useEffect } from 'react';
import {
  ChatProvider,
  ConversationList,
  ChatWindow,
  useContacts,
  useConversations,
  useConversation,
  useMessages,
  useRealtimeMessages,
  useRealtimeContactConversations,
  useRealtimeContactStatus,
  useTypingIndicator,
  Contact,
  Conversation,
} from '@genit-io/chat-react';

// Configuration
const config = {
  api: {
    baseUrl: 'https://your-api.com',
    apiKey: 'your-api-key',
    projectSlug: 'your-project-slug',
  },
  supabase: {
    url: 'https://your-project.supabase.co',
    anon_key: 'your-supabase-anon-key',
  },
};

// Main Chat Application Component
function AdvancedChatApp() {
  const currentContactUuid = 'your-contact-uuid';
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [selectedParticipantUuid, setSelectedParticipantUuid] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<number, boolean>>({});
  console.log(selectedConversation);
  // Fetch contacts
  const { contacts: contactsList, refresh: refreshContacts } = useContacts({
    is_active: true,
  });

  // Create contacts map for quick lookup
  const contactsMap = React.useMemo(() => {
    const map: Record<number, Contact> = {};
    contactsList.forEach(contact => {
      map[contact.id] = contact;
    });
    return map;
  }, [contactsList]);

  // Fetch conversations
  const {
    conversations,
    loading: conversationsLoading,
    refresh: refreshConversations,
  } = useConversations(currentContactUuid, {
    status: 'active',
  });

  // Get current conversation
  const { conversation, loading: conversationLoading } = useConversation(
    currentContactUuid,
    selectedParticipantUuid
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
  } = useMessages(currentContactUuid, selectedParticipantUuid);

  // Typing indicator
  const { startTyping, stopTyping, subscribeToTyping } = useTypingIndicator(
    conversation?.id || null,
    1
  );

  // Subscribe to real-time message updates
  useRealtimeMessages(conversation?.id || null, event => {
    if (event.type === 'message:created') {
      // Auto-mark as read if conversation is active
      if (event.payload.id && !event.payload.from_me) {
        markAsRead(event.payload.id);
      }
    }
  });

  // Subscribe to conversation updates
  useRealtimeContactConversations(1, event => {
    if (event.type === 'conversation:created' || event.type === 'conversation:updated') {
      refreshConversations();
    }
  });

  // Subscribe to contact status updates
  useRealtimeContactStatus(1, event => {
    refreshContacts();
  });

  // Subscribe to typing indicators
  useEffect(() => {
    if (conversation?.id) {
      subscribeToTyping(event => {
        const typingEvent = event.payload;
        setTypingUsers(prev => ({
          ...prev,
          [typingEvent.contact_id]: typingEvent.is_typing,
        }));
      });
    }
  }, [conversation?.id, subscribeToTyping]);

  // Handle conversation selection
  const handleConversationClick = (conv: Conversation) => {
    setSelectedConversation(conv);
    // Determine which participant to chat with
    const participantId =
      conv.first_participant_id === 1 ? conv.second_participant_id : conv.first_participant_id;
    const participant = contactsMap[participantId];
    if (participant) {
      setSelectedParticipantUuid(participant.uuid);
    }
  };

  // Handle message send
  const handleSendMessage = async (data: any) => {
    stopTyping();
    return sendMessage(data);
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      {/* Conversations Sidebar */}
      <div
        style={{
          width: '350px',
          borderRight: '1px solid #e0e0e0',
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid #e0e0e0',
            fontWeight: 600,
            fontSize: '18px',
          }}
        >
          Conversations
        </div>

        <ConversationList
          conversations={conversations}
          contacts={contactsMap}
          activeConversationId={conversation?.id}
          loading={conversationsLoading}
          onConversationClick={handleConversationClick}
        />
      </div>

      {/* Chat Window */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ChatWindow
          conversation={conversation}
          contact={
            selectedParticipantUuid ? contactsMap[conversation?.second_participant_id || 0] : null
          }
          messageListProps={{
            messages,
            currentContactId: 1,
            contacts: contactsMap,
            loading: messagesLoading,
            onMessageDelete: deleteMessage,
            hasMore,
            onLoadMore: loadMore,
          }}
          messageInputProps={{
            onSend: handleSendMessage,
            onTyping: startTyping,
            onStopTyping: stopTyping,
            placeholder: 'Type a message...',
          }}
        />

        {/* Typing indicator */}
        {Object.values(typingUsers).some(typing => typing) && (
          <div
            style={{
              position: 'absolute',
              bottom: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
            }}
          >
            Someone is typing...
          </div>
        )}
      </div>
    </div>
  );
}

// App with Provider
export default function App() {
  return (
    <ChatProvider apiConfig={config.api} supabaseConfig={config.supabase} autoInitialize>
      <AdvancedChatApp />
    </ChatProvider>
  );
}
