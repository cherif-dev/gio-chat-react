/**
 * Basic Usage Example
 *
 * This example demonstrates how to set up a simple chat application
 * using @genit-io/chat-react
 */

import React, { useState } from 'react';
import {
  ChatProvider,
  ChatWindow,
  useConversation,
  useMessages,
  useRealtimeMessages,
} from '@genit-io/chat-react';

// Step 1: Configure your API and Supabase settings
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

// Step 2: Create your chat component
function SimpleChatComponent() {
  const contactUuid = 'your-contact-uuid';
  const participantUuid = 'participant-uuid';

  // Get conversation data
  const { conversation, loading: conversationLoading } = useConversation(
    contactUuid,
    participantUuid
  );

  // Get messages and send functionality
  const {
    messages,
    sendMessage,
    deleteMessage,
    loading: messagesLoading,
  } = useMessages(contactUuid, participantUuid);

  // Subscribe to real-time updates
  useRealtimeMessages(conversation?.id || null, event => {
    console.log('Real-time event:', event.type, event.payload);
  });

  if (conversationLoading || messagesLoading) {
    return <div>Loading chat...</div>;
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ChatWindow
        conversation={conversation}
        contact={null}
        messageListProps={{
          messages,
          currentContactId: 1, // Your current contact ID
          onMessageDelete: deleteMessage,
        }}
        messageInputProps={{
          onSend: sendMessage,
          placeholder: 'Type your message...',
        }}
      />
    </div>
  );
}

// Step 3: Wrap your app with ChatProvider
export default function App() {
  return (
    <ChatProvider apiConfig={config.api} supabaseConfig={config.supabase} autoInitialize>
      <SimpleChatComponent />
    </ChatProvider>
  );
}
