# ChatWindow Component

A modern, clean chat window component with Tailwind CSS styling featuring a beautiful header with action buttons.

## Features

- 🎨 **Modern Design**: Clean and professional UI using Tailwind CSS
- 👤 **Avatar Display**: Shows user avatar with fallback to initials
- 🟢 **Online Status**: Real-time online/offline indicator
- 📱 **Responsive**: Works seamlessly on all screen sizes
- 🎯 **Action Buttons**: Search, video call, phone call, and menu options
- ⚡ **Smooth Transitions**: Hover effects and animations
- ♿ **Accessible**: ARIA labels and semantic HTML

## Header Design

The header includes:

- **Avatar**: Circular avatar with online status indicator (green dot)
- **Contact Name**: Display name with truncation for long names
- **Status**: "Active Now" for online users, "Offline" for others
- **Action Icons**:
  - 🔍 Search: Search through conversation messages
  - 📹 Video Call: Start a video call
  - 📞 Phone Call: Start an audio call
  - ⋮ Menu: Additional options

## Usage

```tsx
import { ChatWindow } from '@genit-io/chat-react';

function MyChat() {
  return (
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
      // Header props
      showHeader={true}
      onBack={() => console.log('Back clicked')}
      onSearchClick={() => console.log('Search clicked')}
      onVideoCallClick={() => console.log('Video call clicked')}
      onPhoneCallClick={() => console.log('Phone call clicked')}
      onMenuClick={() => console.log('Menu clicked')}
    />
  );
}
```

## Props

### ChatWindowProps

| Prop                | Type                   | Required | Default | Description                                |
| ------------------- | ---------------------- | -------- | ------- | ------------------------------------------ |
| `conversation`      | `Conversation \| null` | Yes      | -       | The conversation object                    |
| `contact_uuid`      | `string \| null`       | Yes      | -       | UUID of the contact                        |
| `messageListProps`  | `MessageListProps`     | Yes      | -       | Props for the message list component       |
| `messageInputProps` | `MessageInputProps`    | Yes      | -       | Props for the message input component      |
| `onBack`            | `() => void`           | No       | -       | Callback when back button is clicked       |
| `showHeader`        | `boolean`              | No       | `true`  | Whether to show the header                 |
| `className`         | `string`               | No       | `''`    | Additional CSS classes                     |
| `onSearchClick`     | `() => void`           | No       | -       | Callback when search button is clicked     |
| `onVideoCallClick`  | `() => void`           | No       | -       | Callback when video call button is clicked |
| `onPhoneCallClick`  | `() => void`           | No       | -       | Callback when phone call button is clicked |
| `onMenuClick`       | `() => void`           | No       | -       | Callback when menu button is clicked       |

## Styling

The component uses Tailwind CSS for styling. Make sure you have Tailwind CSS configured in your project.

### Customization

You can customize the appearance by:

1. **Overriding Tailwind classes**: Pass custom classes via the `className` prop
2. **Tailwind configuration**: Extend the theme in your `tailwind.config.js`
3. **CSS variables**: Define custom colors and spacing

Example:

```tsx
<ChatWindow
  className="shadow-2xl rounded-lg"
  // ... other props
/>
```

## Action Handlers

### Search

Implement search functionality to find messages in the conversation:

```tsx
const handleSearch = () => {
  // Open search modal or input
  // Filter messages based on search query
};
```

### Video Call

Integrate with your video calling solution:

```tsx
const handleVideoCall = () => {
  // Use WebRTC, Twilio, Agora, etc.
  // Open video call interface
};
```

### Phone Call

Implement audio calling:

```tsx
const handlePhoneCall = () => {
  // Use VoIP solution
  // Start audio call
};
```

### Menu

Show additional options:

```tsx
const handleMenu = () => {
  // Show context menu with options:
  // - Mute conversation
  // - Block user
  // - Report
  // - Clear chat
  // - View profile
};
```

## Examples

See the complete example in `examples/modern-chat-header.tsx` for a full implementation.

## Dependencies

- React 18+
- Tailwind CSS 3+
- `@genit-io/chat-react` types and utilities

## Accessibility

The component includes:

- ARIA labels for all interactive elements
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly

## Browser Support

Works on all modern browsers:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)
