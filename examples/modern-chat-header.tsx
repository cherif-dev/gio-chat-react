/**
 * Modern Chat Header Example
 *
 * This example demonstrates how to use the ChatWindow with the new modern header
 * featuring Tailwind CSS styling and action buttons (search, video call, phone call, menu)
 */

import React, { useState } from 'react';
import {
  ChatProvider,
  ChatWindow,
  useConversation,
  useMessages,
  useRealtimeMessages,
} from '@genit-io/chat-react';

// Configure your API and Supabase settings
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

// Modern Chat Component with Action Handlers
function ModernChatComponent() {
  const contactUuid = 'your-contact-uuid';
  const participantUuid = 'participant-uuid';
  const [searchOpen, setSearchOpen] = useState(false);

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

  // Action handlers
  const handleSearch = () => {
    console.log('Search clicked');
    setSearchOpen(!searchOpen);
    // Implement your search functionality here
  };

  const handleVideoCall = () => {
    console.log('Video call clicked');
    // Implement video call functionality here
    // Example: Open video call modal or navigate to video call page
  };

  const handlePhoneCall = () => {
    console.log('Phone call clicked');
    // Implement phone call functionality here
    // Example: Initiate audio call
  };

  const handleMenu = () => {
    console.log('Menu clicked');
    // Implement menu functionality here
    // Example: Show conversation options, settings, etc.
  };

  const handleBack = () => {
    console.log('Back clicked');
    // Implement navigation back to conversation list
  };

  if (conversationLoading || messagesLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <ChatWindow
        conversation={conversation}
        contact_uuid={contactUuid}
        messageListProps={{
          messages,
          currentContactId: contactUuid,
          onMessageDelete: deleteMessage,
        }}
        messageInputProps={{
          onSend: sendMessage,
          placeholder: 'Type your message...',
        }}
        // Modern header props
        showHeader={true}
        onBack={handleBack}
        onSearchClick={handleSearch}
        onVideoCallClick={handleVideoCall}
        onPhoneCallClick={handlePhoneCall}
        onMenuClick={handleMenu}
      />

      {/* Search overlay example (optional) */}
      {searchOpen && (
        <div className="absolute top-0 left-0 right-0 bg-white shadow-lg p-4 z-50">
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

// Wrap your app with ChatProvider
export default function App() {
  return (
    <ChatProvider apiConfig={config.api} supabaseConfig={config.supabase} autoInitialize>
      <ModernChatComponent />
    </ChatProvider>
  );
}
