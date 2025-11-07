# @genit-io/chat-react

A comprehensive React package for building chat applications with real-time support, designed to work seamlessly with Laravel backends and Supabase real-time database.

## Features

✨ **Full-featured Chat Components** - Ready-to-use chat UI components  
🔄 **Real-time Updates** - Built-in Supabase real-time integration  
🎣 **React Hooks** - Powerful hooks for data fetching and state management  
📡 **API Services** - Complete service layer for backend communication  
💬 **Message Management** - Send, receive, edit, and delete messages  
👥 **Contact Management** - Manage contacts and their statuses  
🗨️ **Conversation Handling** - Create and manage conversations  
⌨️ **Typing Indicators** - Real-time typing status  
👁️ **Presence Detection** - Know who's viewing conversations  
🎨 **Customizable** - Fully customizable components and styles  
📱 **Responsive** - Mobile-friendly design  
🔐 **Type-safe** - Written in TypeScript

## Installation

```bash
npm install @genit-io/chat-react
# or
yarn add @genit-io/chat-react
# or
pnpm add @genit-io/chat-react
```

### Tailwind CSS Requirement

The components use **Tailwind CSS** for modern, clean styling. Make sure to install and configure Tailwind CSS in your project:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Add the package to your Tailwind config:

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './node_modules/@genit-io/chat-react/dist/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

## Quick Start

### 1. Setup the ChatProvider

Wrap your application with the `ChatProvider` to initialize the package:

```tsx
import React from 'react';
import { ChatProvider, GlobalConfig } from '@genit-io/chat-react';

function App() {
  const config: GlobalConfig = {
    api: {
      baseUrl: 'https://your-api.com',
      apiKey: 'your-api-key',
      projectSlug: 'your-project-slug',
      timeout: 30000, // optional, defaults to 30000ms
      headers: {
        // optional additional headers
        'X-Custom-Header': 'custom-value',
      },
    },
    supabase: {
      url: 'https://your-project.supabase.co',
      anon_key: 'your-anon-key',
      schema: 'public', // optional, defaults to 'public'
      options: {
        // optional Supabase options
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      },
    },
  };

  return (
    <ChatProvider config={config} autoInitialize>
      <YourApp />
    </ChatProvider>
  );
}
```

### 2. Use Chat Components

```tsx
import React from 'react';
import {
  ChatWindow,
  useMessages,
  useConversation,
  useRealtimeMessages,
} from '@genit-io/chat-react';

function ChatPage() {
  const contactUuid = 'contact-uuid';
  const participantUuid = 'participant-uuid';

  const { conversation } = useConversation(contactUuid, participantUuid);
  const { messages, sendMessage } = useMessages(contactUuid, participantUuid);

  // Subscribe to real-time message updates
  useRealtimeMessages(conversation?.id || null, event => {
    console.log('New message:', event.payload);
  });

  return (
    <ChatWindow
      conversation={conversation}
      contact={null}
      messageListProps={{
        messages,
        currentContactId: 1,
      }}
      messageInputProps={{
        onSend: sendMessage,
      }}
    />
  );
}
```

## API Reference

### Configuration

#### ApiConfig

```typescript
interface ApiConfig {
  baseUrl: string; // Your API base URL
  apiKey: string; // API authentication key
  projectSlug: string; // Project identifier
  timeout?: number; // Request timeout (default: 30000ms)
  headers?: Record<string, string>; // Additional headers
}
```

#### SupabaseConfig

```typescript
interface SupabaseConfig {
  url: string; // Supabase project URL
  anon_key: string; // Supabase anonymous key
  schema?: string; // Database schema (default: 'public')
  options?: {
    auth?: {
      persistSession?: boolean;
      autoRefreshToken?: boolean;
    };
    realtime?: {
      params?: {
        eventsPerSecond?: number;
      };
    };
  };
}
```

#### GlobalConfig

```typescript
interface GlobalConfig {
  api: ApiConfig;
  supabase: SupabaseConfig;
}
```

### Configuration Service

The library now uses a configuration service pattern instead of environment variables. This provides better type safety and validation:

```typescript
import { configService, ConfigValidationError } from '@genit-io/chat-react';

// Initialize the configuration service
try {
  configService.initialize(config);
} catch (error) {
  if (error instanceof ConfigValidationError) {
    console.error('Configuration validation failed:', error.message);
  }
}

// Check if initialized
if (configService.isServiceInitialized()) {
  const apiConfig = configService.getApiConfig();
  const supabaseConfig = configService.getSupabaseConfig();
}
```

### Hooks

#### useContacts

Fetch and manage contacts list:

```typescript
const {
  contacts, // Contact[]
  loading, // boolean
  error, // ApiError | null
  hasMore, // boolean
  loadMore, // () => void
  refresh, // () => void
} = useContacts(filters);
```

#### useContact

Fetch and manage a single contact:

```typescript
const {
  contact, // Contact | null
  loading, // boolean
  error, // ApiError | null
  updating, // boolean
  updateContact, // (data: UpdateContactRequest) => Promise<Contact>
  updateOnlineStatus, // (isOnline: boolean) => Promise<void>
  refresh, // () => void
} = useContact(uuid);
```

#### useConversations

Fetch and manage conversations:

```typescript
const {
  conversations, // Conversation[]
  loading, // boolean
  error, // ApiError | null
  hasMore, // boolean
  loadMore, // () => void
  refresh, // () => void
} = useConversations(contactUuid, filters);
```

#### useConversation

Fetch and manage a single conversation:

```typescript
const {
  conversation, // Conversation | null
  loading, // boolean
  error, // ApiError | null
  updating, // boolean
  updateConversation, // (data: UpdateConversationRequest) => Promise<Conversation>
  assignConversation, // (data: AssignConversationRequest) => Promise<Conversation>
  unassignConversation, // () => Promise<Conversation>
  updateStatus, // (data: UpdateConversationStatusRequest) => Promise<Conversation>
  pin, // () => Promise<void>
  unpin, // () => Promise<void>
  star, // () => Promise<void>
  unstar, // () => Promise<void>
  archive, // () => Promise<void>
  unarchive, // () => Promise<void>
  refresh, // () => void
} = useConversation(contactUuid, participantUuid);
```

#### useMessages

Fetch and manage messages:

```typescript
const {
  messages, // Message[]
  loading, // boolean
  error, // ApiError | null
  sending, // boolean
  hasMore, // boolean
  messagesEndRef, // RefObject<HTMLDivElement>
  sendMessage, // (data: CreateMessageRequest) => Promise<Message>
  updateMessage, // (messageId: number, data: UpdateMessageRequest) => Promise<Message>
  deleteMessage, // (messageId: number) => Promise<void>
  markAsRead, // (messageId: number) => Promise<void>
  markAsDelivered, // (messageId: number) => Promise<void>
  loadMore, // () => void
  refresh, // () => void
  scrollToBottom, // () => void
} = useMessages(contactUuid, participantUuid, filters);
```

#### useRealtimeMessages

Subscribe to real-time message updates:

```typescript
useRealtimeMessages(conversationId, (event: RealtimeEvent<Message>) => {
  // Handle new message event
  console.log('Event type:', event.type); // 'message:created' | 'message:updated' | 'message:deleted'
  console.log('Message:', event.payload);
});
```

#### useRealtimeConversation

Subscribe to real-time conversation updates:

```typescript
useRealtimeConversation(conversationId, (event: RealtimeEvent<Conversation>) => {
  // Handle conversation update
});
```

#### useTypingIndicator

Manage typing indicators:

```typescript
const {
  startTyping, // () => void
  stopTyping, // () => void
  subscribeToTyping, // (callback) => void
} = useTypingIndicator(conversationId, contactId);
```

### Components

#### ChatWindow

Complete chat window with modern header, message list, and input (requires Tailwind CSS):

```tsx
<ChatWindow
  conversation={conversation}
  contact_uuid={contactUuid}
  messageListProps={{
    messages,
    currentContactId,
    onMessageDelete,
    onMessageEdit,
  }}
  messageInputProps={{
    onSend: sendMessage,
    onTyping: startTyping,
    onStopTyping: stopTyping,
  }}
  // Header props
  showHeader={true}
  onBack={() => console.log('Back clicked')}
  onSearchClick={() => console.log('Search clicked')}
  onVideoCallClick={() => console.log('Video call clicked')}
  onPhoneCallClick={() => console.log('Phone call clicked')}
  onMenuClick={() => console.log('Menu clicked')}
/>
```

**Modern Header Features:**

- ✨ Clean, professional design with Tailwind CSS
- 👤 Avatar with online status indicator (green dot)
- 📊 "Active Now" status for online users
- 🔍 Search button for finding messages
- 📹 Video call button
- 📞 Phone call button
- ⋮ Menu button for additional options
- 🎨 Smooth hover effects and transitions

See [ChatWindow README](src/components/ChatWindow/README.md) for detailed documentation.

#### MessageList

Modern message list with clean design (requires Tailwind CSS):

```tsx
<MessageList
  messages={messages}
  currentContactId={currentContactId}
  contacts={contactsMap}
  loading={loading}
  onLoadMore={loadMore}
  onMessageDelete={deleteMessage}
  onMessageEdit={editMessage}
  hasMore={hasMore}
/>
```

**Modern Features:**

- ✨ Clean, rounded message bubbles with shadows
- 👤 Circular avatars with fallback initials
- 📷 Image attachment support with rounded corners
- 🔗 Auto-detected clickable links
- 📅 Elegant date separators
- ✓ Message status indicators (sent, delivered, read)
- 🎨 Smooth animations and transitions
- 📱 Responsive layout with proper spacing
- 🔄 Loading states with animated spinners
- 💬 Empty state with friendly icon

See [MessageList README](src/components/MessageList/README.md) for detailed documentation.

#### MessageInput

Modern input field for sending messages (requires Tailwind CSS):

```tsx
<MessageInput
  onSend={sendMessage}
  onTyping={startTyping}
  onStopTyping={stopTyping}
  placeholder="Type a message..."
  disabled={false}
  maxLength={10000}
  showVoice={true}
  showAttachment={true}
  showEmoji={true}
  showLocation={false}
/>
```

**Props:**

- `showVoice` - Display voice message button (default: true)
- `showAttachment` - Display attachment button (default: true)
- `showEmoji` - Display emoji picker button (default: true)
- `showLocation` - Display location sharing button (default: false)
- All buttons include smooth hover animations and proper accessibility

See [MessageInput README](src/components/MessageInput/README.md) for detailed documentation.

#### MessageBubble

Modern individual message bubble (requires Tailwind CSS):

```tsx
<MessageBubble
  message={message}
  isFromMe={true}
  showAvatar={false}
  avatarUrl="https://..."
  senderName="John Doe"
  onDelete={handleDelete}
  onEdit={handleEdit}
/>
```

**Features:**

- Clean design with rounded corners and subtle shadows
- Support for text, images, and mixed content
- Automatic link detection and styling
- Status indicators for sent/delivered/read
- Responsive alignment (incoming left, outgoing right)
- Avatar display for incoming messages
- Sender name display

#### ConversationList

List of conversations:

```tsx
<ConversationList
  conversations={conversations}
  contacts={contactsMap}
  activeConversationId={activeId}
  loading={loading}
  onConversationClick={handleClick}
  onLoadMore={loadMore}
  hasMore={hasMore}
/>
```

### Services

Direct API service methods for advanced use cases:

#### ContactService

```typescript
import { ContactService } from '@genit-io/chat-react';

// Get contacts
const response = await ContactService.getContacts(filters);

// Get single contact
const contact = await ContactService.getContact(uuid);

// Create contact
const newContact = await ContactService.createContact(data);

// Update contact
const updated = await ContactService.updateContact(uuid, data);

// Delete contact
await ContactService.deleteContact(uuid);

// Approve/Reject contact
await ContactService.approveContact(uuid);
await ContactService.rejectContact(uuid);

// Update online status
await ContactService.updateOnlineStatus(uuid, { is_online: true });
```

#### ConversationService

```typescript
import { ConversationService } from '@genit-io/chat-react';

// Get conversations
const response = await ConversationService.getConversations(contactUuid, filters);

// Get conversation
const conversation = await ConversationService.getConversation(contactUuid, participantUuid);

// Create conversation
const newConversation = await ConversationService.createConversation(contactUuid, data);

// Update conversation
const updated = await ConversationService.updateConversation(contactUuid, conversationId, data);

// Assign conversation
await ConversationService.assignConversation(contactUuid, conversationId, { contact_id: agentId });

// Pin/Star/Archive
await ConversationService.pinConversation(contactUuid, conversationId);
await ConversationService.starConversation(contactUuid, conversationId);
await ConversationService.archiveConversation(contactUuid, conversationId);
```

#### MessageService

```typescript
import { MessageService } from '@genit-io/chat-react';

// Get messages
const response = await MessageService.getMessages(contactUuid, participantUuid, filters);

// Send message
const message = await MessageService.createMessage(contactUuid, participantUuid, {
  content: 'Hello!',
  type: 'text',
});

// Update message
const updated = await MessageService.updateMessage(contactUuid, participantUuid, messageId, data);

// Delete message
await MessageService.deleteMessage(contactUuid, participantUuid, messageId);

// Mark as read/delivered
await MessageService.markAsRead(contactUuid, participantUuid, messageId);
await MessageService.markAsDelivered(contactUuid, participantUuid, messageId);
```

### Context

#### ChatProvider

Provider component for global chat state:

```tsx
<ChatProvider apiConfig={apiConfig} supabaseConfig={supabaseConfig} autoInitialize={true}>
  {children}
</ChatProvider>
```

#### useChatContext

Access chat context:

```typescript
const {
  isInitialized, // boolean
  apiConfig, // ApiConfig | null
  supabaseConfig, // SupabaseConfig | null
  currentContact, // Contact | null
  setCurrentContact, // (contact: Contact | null) => void
  currentConversation, // Conversation | null
  setCurrentConversation, // (conversation: Conversation | null) => void
  isSidebarOpen, // boolean
  toggleSidebar, // () => void
  setSidebarOpen, // (isOpen: boolean) => void
  initialize, // (apiConfig, supabaseConfig?) => void
  isRealtimeEnabled, // boolean
} = useChatContext();
```

### Utilities

#### Formatters

```typescript
import {
  formatRelativeTime,
  formatDateTime,
  formatMessageTime,
  formatConversationTime,
  formatFileSize,
  formatDuration,
  truncateText,
  getInitials,
  formatPhoneNumber,
} from '@genit-io/chat-react';

formatRelativeTime('2024-01-01T12:00:00Z'); // "2 hours ago"
formatDateTime('2024-01-01T12:00:00Z'); // "Jan 1, 2024 12:00 PM"
formatMessageTime('2024-01-01T12:00:00Z'); // "12:00 PM" or "Yesterday" or "Jan 1"
formatFileSize(1024 * 1024); // "1 MB"
getInitials('John Doe'); // "JD"
```

#### Validators

```typescript
import {
  isValidEmail,
  isValidPhone,
  isValidUrl,
  sanitizeHtml,
  isEmpty,
  isValidMessage,
  isValidFileSize,
  isValidFileType,
  isValidUUID,
} from '@genit-io/chat-react';

isValidEmail('test@example.com'); // true
isValidPhone('+1234567890'); // true
isValidMessage('Hello world'); // true
```

#### Helpers

```typescript
import {
  groupMessagesByDate,
  getContactDisplayName,
  isMessageFromMe,
  debounce,
  throttle,
  sortMessagesByTime,
  getUnreadCount,
  storage,
} from '@genit-io/chat-react';

// Group messages by date
const grouped = groupMessagesByDate(messages);

// Get display name with fallback
const name = getContactDisplayName(contact);

// Storage wrapper
storage.set('key', { data: 'value' });
const data = storage.get('key');
```

## Styling

The package includes default CSS styles for all components. You can customize them by:

### 1. Override CSS Variables

```css
:root {
  --chat-primary-color: #007bff;
  --chat-background: #fff;
  --chat-text-color: #333;
  --chat-border-color: #e0e0e0;
}
```

### 2. Override Component Styles

```css
.message-bubble {
  /* Your custom styles */
}

.conversation-list-item {
  /* Your custom styles */
}
```

### 3. Use Custom className Props

```tsx
<ChatWindow className="my-custom-chat" />
<MessageList className="my-custom-list" />
```

## Examples

### Complete Chat Application

```tsx
import React, { useState } from 'react';
import {
  ChatProvider,
  ConversationList,
  ChatWindow,
  useConversations,
  useConversation,
  useMessages,
  useRealtimeMessages,
  useRealtimeContactConversations,
} from '@genit-io/chat-react';

function ChatApp() {
  const [contactUuid] = useState('your-contact-uuid');
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  const { conversations, refresh: refreshConversations } = useConversations(contactUuid);

  const { conversation } = useConversation(contactUuid, selectedParticipant?.uuid || null);

  const { messages, sendMessage, deleteMessage, loadMore, hasMore } = useMessages(
    contactUuid,
    selectedParticipant?.uuid || null
  );

  // Real-time updates
  useRealtimeMessages(conversation?.id || null, event => {
    if (event.type === 'message:created') {
      // Message will be automatically added to the list
    }
  });

  useRealtimeContactConversations(1, event => {
    if (event.type === 'conversation:created') {
      refreshConversations();
    }
  });

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '300px', borderRight: '1px solid #e0e0e0' }}>
        <ConversationList
          conversations={conversations}
          activeConversationId={conversation?.id}
          onConversationClick={conv => {
            // Set selected participant based on conversation
            setSelectedParticipant({ uuid: conv.second_participant_id });
          }}
        />
      </div>

      <div style={{ flex: 1 }}>
        <ChatWindow
          conversation={conversation}
          contact={selectedParticipant}
          messageListProps={{
            messages,
            currentContactId: 1,
            onLoadMore: loadMore,
            onMessageDelete: deleteMessage,
            hasMore,
          }}
          messageInputProps={{
            onSend: sendMessage,
          }}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <ChatProvider
      apiConfig={{
        baseUrl: 'https://your-api.com',
        apiKey: 'your-api-key',
        projectSlug: 'your-project',
      }}
      supabaseConfig={{
        url: 'https://your-project.supabase.co',
        anon_key: 'your-anon-key',
      }}
      autoInitialize
    >
      <ChatApp />
    </ChatProvider>
  );
}

export default App;
```

## TypeScript Support

This package is written in TypeScript and provides full type definitions. All types are exported for your use:

```typescript
import type {
  Message,
  Contact,
  Conversation,
  MessageStatus,
  ConversationStatus,
  ApiConfig,
  SupabaseConfig,
  // ... and many more
} from '@genit-io/chat-react';
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT © Genit.io

## Support

For issues and questions:

- GitHub Issues: [https://github.com/genit-io/chat-react/issues](https://github.com/genit-io/chat-react/issues)
- Email: support@genit.io

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.
