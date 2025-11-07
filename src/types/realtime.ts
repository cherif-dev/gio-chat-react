// Note: SupabaseConfig is now defined in api.ts to avoid duplication

/**
 * Real-time event types
 */
export type RealtimeEventType =
  | 'message:created'
  | 'message:updated'
  | 'message:deleted'
  | 'message:read'
  | 'message:delivered'
  | 'contact:created'
  | 'contact:updated'
  | 'contact:deleted'
  | 'contact:online'
  | 'contact:offline'
  | 'conversation:created'
  | 'conversation:updated'
  | 'conversation:deleted'
  | 'conversation:assigned'
  | 'conversation:status_changed'
  | 'typing:start'
  | 'typing:stop';

/**
 * Real-time event payload
 */
export interface RealtimeEvent<T = any> {
  type: RealtimeEventType;
  payload: T;
  timestamp: string;
}

/**
 * Typing indicator event
 */
export interface TypingEvent {
  conversation_id: number;
  contact_id: number;
  is_typing: boolean;
}

// SupabaseConfig is now defined in api.ts

/**
 * Real-time subscription
 */
export interface RealtimeSubscription {
  unsubscribe: () => void;
  isSubscribed: boolean;
}

/**
 * Real-time channel options
 */
export interface ChannelOptions {
  projectId?: number;
  contactId?: number;
  conversationId?: number;
}
