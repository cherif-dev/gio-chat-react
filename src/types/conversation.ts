import { Contact } from './contact';
import { Message } from './message';

/**
 * Conversation status types
 */
export type ConversationStatus = 'active' | 'pending' | 'resolved' | 'closed' | 'archived';

/**
 * Conversation priority types
 */
export type ConversationPriority = 'low' | 'normal' | 'high' | 'urgent';

/**
 * Conversation type
 */
export type ConversationType =
  | 'support'
  | 'sales'
  | 'general'
  | 'complaint'
  | 'feedback'
  | 'technical';

/**
 * Conversation channel
 */
export type ConversationChannel = 'chat' | 'email' | 'phone' | 'video' | 'social';

/**
 * Assignment history entry
 */
export interface AssignmentHistoryEntry {
  assigned_to: number | null;
  assigned_by: number;
  assigned_at: string;
  previous_assigned_to: number | null;
}

/**
 * Conversation interface
 */
export interface Conversation {
  id: number;
  project_id: number;
  first_participant_id: number;
  second_participant_id: number;
  participants: number[] | null;
  uuid: string;
  title: string | null;
  description: string | null;
  reference_number: string | null;
  tags: string[] | null;
  status: ConversationStatus;
  priority: ConversationPriority;
  type: ConversationType;
  channel: ConversationChannel;
  is_private: boolean;
  is_archived: boolean;
  is_pinned: boolean;
  is_starred: boolean;
  auto_assign_enabled: boolean;
  notifications_enabled: boolean;
  typing_indicators_enabled: boolean;
  read_receipts_enabled: boolean;
  started_at: string | null;
  last_activity_at: string | null;
  resolved_at: string | null;
  closed_at: string | null;
  archived_at: string | null;
  scheduled_at: string | null;
  expires_at: string | null;
  assigned_to: number | null;
  assigned_by: number | null;
  assigned_at: string | null;
  assignment_history: AssignmentHistoryEntry[] | null;
  queue_name: string | null;
  queue_position: number | null;
  message_count: number;
  contact_count: number;
  response_count: number;
  average_response_time: number | null;
  satisfaction_rating: number | null;
  escalation_count: number;
  first_response_at: string | null;
  last_response_at: string | null;
  context_data: Record<string, any> | null;
  custom_fields: Record<string, any> | null;
  attachments: any[] | null;
  notes: string | null;
  escalation_rules: any[] | null;
  bot_enabled: boolean;
  bot_name: string | null;
  bot_context: Record<string, any> | null;
  auto_responder_triggered: boolean;
  auto_responder_sent_at: string | null;
  external_id: string | null;
  external_source: string | null;
  integration_data: Record<string, any> | null;
  webhook_data: Record<string, any> | null;
  is_encrypted: boolean;
  encryption_key: string | null;
  compliance_required: boolean;
  compliance_data: Record<string, any> | null;
  retention_expires_at: string | null;
  quality_metrics: Record<string, any> | null;
  feedback_notes: string | null;
  reviewed_by: number | null;
  reviewed_at: string | null;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  // Computed attributes
  display_title?: string;
  status_color?: string;
  priority_color?: string;
  formatted_response_time?: string;
  formatted_satisfaction_rating?: string;
  first_participant?: Contact;
  second_participant?: Contact;
  last_message?: Message;
}

/**
 * Create conversation request
 */
export interface CreateConversationRequest {
  title?: string;
  description?: string;
  type?: ConversationType;
  channel?: ConversationChannel;
  priority?: ConversationPriority;
  tags?: string[];
  is_private?: boolean;
  custom_fields?: Record<string, any>;
}

/**
 * Update conversation request
 */
export interface UpdateConversationRequest {
  title?: string;
  description?: string;
  status?: ConversationStatus;
  priority?: ConversationPriority;
  type?: ConversationType;
  tags?: string[];
  custom_fields?: Record<string, any>;
  notes?: string;
}

/**
 * Conversation filters
 */
export interface ConversationFilters {
  status?: ConversationStatus;
  priority?: ConversationPriority;
  type?: ConversationType;
  channel?: ConversationChannel;
  assigned_to?: number;
  is_archived?: boolean;
  is_pinned?: boolean;
  is_starred?: boolean;
  search?: string;
  page?: number;
  per_page?: number;
}

/**
 * Assign conversation request
 */
export interface AssignConversationRequest {
  contact_id: number;
}

/**
 * Update conversation status request
 */
export interface UpdateConversationStatusRequest {
  status: ConversationStatus;
}
