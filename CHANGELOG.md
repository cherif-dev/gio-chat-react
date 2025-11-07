# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Modern, clean chat header design for ChatWindow component using Tailwind CSS
- Avatar with online status indicator (green dot) in chat header
- "Active Now" status text for online users
- Action buttons in chat header:
  - Search button for finding messages in conversation
  - Video call button for starting video calls
  - Phone call button for starting audio calls
  - Menu button for additional options
- New props for ChatWindow component:
  - `onSearchClick` - Callback for search button
  - `onVideoCallClick` - Callback for video call button
  - `onPhoneCallClick` - Callback for phone call button
  - `onMenuClick` - Callback for menu button
- Smooth hover effects and transitions on all action buttons
- Responsive design with proper accessibility (ARIA labels)
- Example implementation in `examples/modern-chat-header.tsx`
- Comprehensive documentation in `src/components/ChatWindow/README.md`
- Tailwind CSS configuration files (tailwind.config.js, postcss.config.js)

### Changed

- ChatWindow component now uses Tailwind CSS for styling instead of traditional CSS
- Updated `contact` prop to `contact_uuid` in ChatWindow component
- Header displays gradient background for avatar placeholder when no image is available

## [1.0.0] - 2024-01-01

### Added

- Initial release
- Complete TypeScript types for Message, Contact, Conversation, and Project models
- API service layer with axios integration
- Supabase real-time service integration
- React hooks for data fetching and state management
  - useContacts, useContact
  - useConversations, useConversation
  - useMessages
  - useRealtimeMessages, useRealtimeConversation
  - useTypingIndicator, usePresence
- ChatProvider context for global state management
- Reusable React components
  - ChatWindow
  - MessageList
  - MessageBubble
  - MessageInput
  - ConversationList
- Utility functions for formatting, validation, and helpers
- Complete documentation
- CSS styling for all components
