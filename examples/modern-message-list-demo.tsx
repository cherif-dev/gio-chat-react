/**
 * Modern Message List Demo
 *
 * This example demonstrates the new modern and clean UI for the MessageList component
 * with Tailwind CSS styling, including support for:
 * - Clean message bubbles with rounded corners
 * - Avatar support
 * - Image attachments
 * - Clickable links
 * - Message status indicators
 * - Date separators
 */

import React from 'react';
import { ChatProvider, MessageList } from '@genit-io/chat-react';
import { Message, Contact } from '@genit-io/chat-react/types';

// Sample configuration
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

// Sample messages data (similar to the design in the image)
const sampleMessages: Message[] = [
  {
    id: 1,
    conversation_id: 1,
    sender_id: 2,
    status: 'read',
    type: 'text',
    from_me: false,
    is_group_msg: false,
    content: 'Hi, Good Morning',
    body: 'Hi, Good Morning',
    uuid: 'msg-1',
    sent_at: '2024-04-04T09:14:00Z',
    delivered_at: '2024-04-04T09:14:01Z',
    read_at: '2024-04-04T09:14:05Z',
    failed_at: null,
    data: null,
    created_at: '2024-04-04T09:14:00Z',
    updated_at: '2024-04-04T09:14:00Z',
    deleted_at: null,
  },
  {
    id: 2,
    conversation_id: 1,
    sender_id: 2,
    status: 'read',
    type: 'text',
    from_me: false,
    is_group_msg: false,
    content: "I'm looking for a t-shirt for an upcoming event. Is it available?",
    body: "I'm looking for a t-shirt for an upcoming event. Is it available?",
    uuid: 'msg-2',
    sent_at: '2024-04-04T09:14:30Z',
    delivered_at: '2024-04-04T09:14:31Z',
    read_at: '2024-04-04T09:14:35Z',
    failed_at: null,
    data: null,
    created_at: '2024-04-04T09:14:30Z',
    updated_at: '2024-04-04T09:14:30Z',
    deleted_at: null,
  },
  {
    id: 3,
    conversation_id: 1,
    sender_id: 1,
    status: 'read',
    type: 'text',
    from_me: true,
    is_group_msg: false,
    content: 'Hi, Sabrina Good Morning',
    body: 'Hi, Sabrina Good Morning',
    uuid: 'msg-3',
    sent_at: '2024-04-04T09:20:00Z',
    delivered_at: '2024-04-04T09:20:01Z',
    read_at: '2024-04-04T09:20:05Z',
    failed_at: null,
    data: null,
    created_at: '2024-04-04T09:20:00Z',
    updated_at: '2024-04-04T09:20:00Z',
    deleted_at: null,
  },
  {
    id: 4,
    conversation_id: 1,
    sender_id: 1,
    status: 'read',
    type: 'image',
    from_me: true,
    is_group_msg: false,
    content: 'Yes, we have a selection of formal t-shirts. You can view them here',
    body: 'Yes, we have a selection of formal t-shirts. You can view them here',
    uuid: 'msg-4',
    sent_at: '2024-04-04T09:25:00Z',
    delivered_at: '2024-04-04T09:25:01Z',
    read_at: '2024-04-04T09:25:05Z',
    failed_at: null,
    data: {
      image_url:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop',
    },
    created_at: '2024-04-04T09:25:00Z',
    updated_at: '2024-04-04T09:25:00Z',
    deleted_at: null,
  },
  {
    id: 5,
    conversation_id: 1,
    sender_id: 1,
    status: 'read',
    type: 'text',
    from_me: true,
    is_group_msg: false,
    content: 'https://sofia.com/product/tshirt/formal',
    body: 'https://sofia.com/product/tshirt/formal',
    uuid: 'msg-5',
    sent_at: '2024-04-04T09:25:30Z',
    delivered_at: '2024-04-04T09:25:31Z',
    read_at: '2024-04-04T09:25:35Z',
    failed_at: null,
    data: null,
    created_at: '2024-04-04T09:25:30Z',
    updated_at: '2024-04-04T09:25:30Z',
    deleted_at: null,
  },
  {
    id: 6,
    conversation_id: 1,
    sender_id: 2,
    status: 'read',
    type: 'text',
    from_me: false,
    is_group_msg: false,
    content: "That's great! Do you have this t-shirt in black? or navi blue",
    body: "That's great! Do you have this t-shirt in black? or navi blue",
    uuid: 'msg-6',
    sent_at: '2024-04-04T09:26:00Z',
    delivered_at: '2024-04-04T09:26:01Z',
    read_at: '2024-04-04T09:26:05Z',
    failed_at: null,
    data: null,
    created_at: '2024-04-04T09:26:00Z',
    updated_at: '2024-04-04T09:26:00Z',
    deleted_at: null,
  },
];

// Sample contacts data
const sampleContacts: Record<number, Contact> = {
  2: {
    id: 2,
    uuid: 'contact-2',
    project_id: 1,
    phone: '+1234567890',
    first_name: 'Sabrina',
    last_name: null,
    display_name: 'Sabrina',
    display_name_with_fallback: 'Sabrina',
    profile_url: null,
    avatar: 'https://i.pravatar.cc/150?img=5',
    email: null,
    address: null,
    extra: null,
    tags: [],
    metadata: null,
    is_blocked: false,
    is_group: false,
    created_at: '2024-04-04T09:00:00Z',
    updated_at: '2024-04-04T09:00:00Z',
    deleted_at: null,
  },
};

// Demo Component
function ModernMessageListDemo() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl h-[800px] bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Chat Header */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/150?img=5"
              alt="Sabrina"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="font-semibold text-gray-900">Sabrina</h2>
              <p className="text-xs text-gray-500">Active now</p>
            </div>
          </div>
        </div>

        {/* Message List */}
        <div className="h-[calc(100%-64px)]">
          <MessageList
            messages={sampleMessages}
            currentContactId={1}
            contacts={sampleContacts}
            loading={false}
            hasMore={false}
          />
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  return (
    <ChatProvider apiConfig={config.api} supabaseConfig={config.supabase} autoInitialize={false}>
      <ModernMessageListDemo />
    </ChatProvider>
  );
}
