import React from 'react';
import { MessageInput } from '../src/components/Message/MessageInput';
import { CreateMessageRequest, Conversation } from '../src/types';

/**
 * MessageInput Demo - Modern Chat Input with Tailwind CSS
 *
 * This example demonstrates the modern message input component
 * with all features enabled.
 */

const MessageInputDemo: React.FC = () => {
  // Mock conversation for demo
  const mockConversation: Conversation = {
    id: 1,
    project_id: 1,
    first_participant_id: 1,
    second_participant_id: 2,
    participants: [1, 2],
    uuid: 'demo-conversation-uuid',
    title: 'Demo Conversation',
    description: 'A demo conversation for testing',
    reference_number: 'REF-001',
    tags: ['demo', 'test'],
    status: 'active',
    priority: 'normal',
    type: 'general',
    channel: 'chat',
    is_private: false,
    is_archived: false,
    is_pinned: false,
    is_starred: false,
    auto_assign_enabled: false,
    notifications_enabled: true,
    typing_indicators_enabled: true,
    read_receipts_enabled: true,
    started_at: new Date().toISOString(),
    last_activity_at: new Date().toISOString(),
    resolved_at: null,
    closed_at: null,
    archived_at: null,
    scheduled_at: null,
    expires_at: null,
    assigned_to: null,
    assigned_by: null,
    assigned_at: null,
    assignment_history: null,
    queue_name: null,
    queue_position: null,
    message_count: 0,
    contact_count: 2,
    response_count: 0,
    average_response_time: null,
    satisfaction_rating: null,
    escalation_count: 0,
    first_response_at: null,
    last_response_at: null,
    context_data: null,
    custom_fields: null,
    attachments: null,
    notes: null,
    escalation_rules: null,
    bot_enabled: false,
    bot_name: null,
    bot_context: null,
    auto_responder_triggered: false,
    auto_responder_sent_at: null,
    external_id: null,
    external_source: null,
    integration_data: null,
    webhook_data: null,
    is_encrypted: false,
    encryption_key: null,
    compliance_required: false,
    compliance_data: null,
    retention_expires_at: null,
    quality_metrics: null,
    feedback_notes: null,
    reviewed_by: null,
    reviewed_at: null,
    created_by: 1,
    updated_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    first_participant: {
      id: 1,
      uuid: 'user-1-uuid',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      avatar_url: null,
      is_online: true,
      last_seen_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    second_participant: {
      id: 2,
      uuid: 'user-2-uuid',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+0987654321',
      avatar_url: null,
      is_online: false,
      last_seen_at: new Date(Date.now() - 300000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  };

  const handleSendMessage = async (message: CreateMessageRequest) => {
    console.log('Sending message:', message);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Message sent successfully');
  };

  const handleTyping = () => {
    console.log('User is typing...');
  };

  const handleStopTyping = () => {
    console.log('User stopped typing');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Modern Message Input Demo
        </h1>

        {/* Example 1: Full Featured */}
        <div className="bg-white rounded-lg shadow-lg mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
            <h2 className="text-lg font-semibold">Full Featured Input</h2>
            <p className="text-sm text-blue-100">With all buttons enabled</p>
          </div>
          <div className="h-64 bg-gray-50 flex items-center justify-center">
            <p className="text-gray-500">Chat messages would appear here</p>
          </div>
          <MessageInput
            conversation={mockConversation}
            sender_uuid="user-1-uuid"
            onSend={handleSendMessage}
            onTyping={handleTyping}
            onStopTyping={handleStopTyping}
            showAttachment={true}
            showEmoji={true}
            showVoice={true}
            showLocation={true}
            placeholder="Type your message here..."
          />
        </div>

        {/* Example 2: Minimal */}
        <div className="bg-white rounded-lg shadow-lg mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4">
            <h2 className="text-lg font-semibold">Minimal Input</h2>
            <p className="text-sm text-purple-100">Only text and send button</p>
          </div>
          <div className="h-64 bg-gray-50 flex items-center justify-center">
            <p className="text-gray-500">Simple chat interface</p>
          </div>
          <MessageInput
            conversation={mockConversation}
            sender_uuid="user-1-uuid"
            onSend={handleSendMessage}
            showAttachment={false}
            showEmoji={false}
            showVoice={false}
            showLocation={false}
            placeholder="Keep it simple..."
          />
        </div>

        {/* Example 3: Custom Styled */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
            <h2 className="text-lg font-semibold">Custom Styled</h2>
            <p className="text-sm text-green-100">With character limit warning</p>
          </div>
          <div className="h-64 bg-gray-50 flex items-center justify-center">
            <p className="text-gray-500">Custom themed chat</p>
          </div>
          <MessageInput
            conversation={mockConversation}
            sender_uuid="user-1-uuid"
            onSend={handleSendMessage}
            maxLength={200}
            showVoice={true}
            showEmoji={true}
            className="border-t-2 border-green-500"
            placeholder="Maximum 200 characters..."
          />
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Features</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>
                <strong>Auto-expanding textarea:</strong> Grows with content
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>
                <strong>Send on Enter:</strong> Shift+Enter for new line
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>
                <strong>Character counter:</strong> Shows when approaching limit
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>
                <strong>Voice message:</strong> Microphone button for voice input
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>
                <strong>Advanced Attachments:</strong> Dropdown menu with Photos, Documents, Camera
                (auto-detected), Location Sharing
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>
                <strong>Emoji picker:</strong> Add emojis to messages
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>
                <strong>Location sharing:</strong> Share current position with GPS coordinates
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>
                <strong>Typing indicators:</strong> Callback for real-time status
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>
                <strong>Loading state:</strong> Animated spinner while sending
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>
                <strong>Fully accessible:</strong> ARIA labels and keyboard navigation
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>
                <strong>Smart Camera Detection:</strong> Automatically detects camera availability
                and shows option only when supported
              </span>
            </li>
          </ul>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Requirements</h3>
            <p className="text-sm text-blue-800">
              This component requires <strong>Tailwind CSS</strong> to be installed and configured
              in your project.
            </p>
            <pre className="mt-2 p-2 bg-blue-100 rounded text-xs text-blue-900 overflow-x-auto">
              npm install -D tailwindcss postcss autoprefixer
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInputDemo;
