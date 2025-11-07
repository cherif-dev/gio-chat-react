import { Contact } from './contact';

/**
 * Message status types
 */
export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';

/**
 * Message types
 */
export type MessageType =
  | 'text'
  | 'image'
  | 'audio'
  | 'video'
  | 'file'
  | 'location'
  | 'contact'
  | 'sticker'
  | 'buttons'
  | 'list'
  | 'interactive'
  | 'reaction'
  | 'call';

/**
 * Message interface
 */
export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  status: MessageStatus;
  type: MessageType;
  from_me: boolean;
  is_group_msg: boolean;
  content: string | null;
  body: string | null;
  uuid: string;
  sent_at: string | null;
  delivered_at: string | null;
  read_at: string | null;
  failed_at: string | null;
  data: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // Computed attributes
  display_content?: string;
  type_icon?: string;
  status_color?: string;
  formatted_timestamp?: string;
  relative_timestamp?: string;
  sender: Contact;
}

/**
 * Create message request
 */
export interface CreateMessageRequest {
  sender_id: number;
  sender: Contact;
  content?: string;
  body?: string;
  type?: MessageType;
  from_me?: boolean;
  is_group_msg?: boolean;
  data?: Record<string, any>;
}

/**
 * Update message request
 */
export interface UpdateMessageRequest {
  content?: string;
  body?: string;
  type?: MessageType;
  status?: MessageStatus;
  data?: Record<string, any>;
}

/**
 * Message filters
 */
export interface MessageFilters {
  status?: MessageStatus;
  type?: MessageType;
  sender_id?: number;
  from_me?: boolean;
  is_group_msg?: boolean;
  unread?: boolean;
  page?: number;
  per_page?: number;
}
