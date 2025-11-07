# Examples

This directory contains example implementations of the `@genit-io/chat-react` package.

## Basic Usage

The `basic-usage.tsx` file demonstrates:

- Setting up the ChatProvider
- Creating a simple one-on-one chat
- Sending and receiving messages
- Real-time message updates

## Modern Chat Header

The `modern-chat-header.tsx` file demonstrates:

- Modern, clean chat header design with Tailwind CSS
- Avatar with online status indicator
- "Active Now" status text
- Action buttons (search, video call, phone call, menu)
- Smooth hover effects and transitions
- Responsive design
- Custom action handlers for each button

## Modern Message List

The `modern-message-list-demo.tsx` file demonstrates:

- Clean, modern message bubbles with rounded corners
- Sender avatars and names
- Support for text messages, images, and clickable links
- Message status indicators (sent, delivered, read)
- Elegant date separators
- Responsive layout with proper spacing
- Tailwind CSS styling
- Loading and empty states with icons
- Smooth animations and transitions

## Advanced Usage

The `advanced-usage.tsx` file demonstrates:

- Multiple conversations with a sidebar
- Contact list management
- Real-time typing indicators
- Online status tracking
- Message read receipts
- Custom styling

## Running the Examples

These examples are meant to be used as references. To use them in your project:

1. Install the package:

```bash
npm install @genit-io/chat-react
```

2. Copy the example code into your React application

3. Update the configuration with your API and Supabase credentials:

```typescript
const config = {
  api: {
    baseUrl: 'YOUR_API_URL',
    apiKey: 'YOUR_API_KEY',
    projectSlug: 'YOUR_PROJECT_SLUG',
  },
  supabase: {
    url: 'YOUR_SUPABASE_URL',
    anon_key: 'YOUR_SUPABASE_ANON_KEY',
  },
};
```

4. Update the UUIDs and IDs to match your data:

```typescript
const currentContactUuid = 'your-contact-uuid';
const participantUuid = 'participant-uuid';
const currentContactId = 1; // Your contact ID
```

## More Examples

For more examples and use cases, please visit:

- [Documentation](https://github.com/genit-io/chat-react)
- [API Reference](https://github.com/genit-io/chat-react#api-reference)

## Need Help?

If you have questions or need help with the examples:

- Open an issue: https://github.com/genit-io/chat-react/issues
- Email: support@genit.io
