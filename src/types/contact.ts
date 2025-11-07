/**
 * Contact role types
 */
export type ContactRole = 'owner' | 'admin' | 'moderator' | 'member' | 'guest';

/**
 * Approval status types
 */
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

/**
 * Contact interface
 */
export interface Contact {
  id: number;
  project_id: number;
  uuid: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  display_name: string | null;
  bio: string | null;
  avatar: string | null;
  custom_fields: Record<string, any> | null;
  role: ContactRole;
  permissions: string[] | null;
  is_active: boolean;
  is_online: boolean;
  last_seen_at: string | null;
  joined_at: string | null;
  left_at: string | null;
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  notification_preferences: Record<string, any> | null;
  can_send_messages: boolean;
  can_share_files: boolean;
  can_start_calls: boolean;
  can_invite_others: boolean;
  max_concurrent_chats: number | null;
  is_agent: boolean;
  agent_specialty: string | null;
  max_chat_load: number | null;
  response_time_target: number | null;
  satisfaction_rating: number | null;
  invitation_token: string | null;
  invited_at: string | null;
  invitation_expires_at: string | null;
  invited_by: number | null;
  requires_approval: boolean;
  approval_status: ApprovalStatus | null;
  approved_by: number | null;
  approved_at: string | null;
  total_messages_sent: number;
  total_files_shared: number;
  total_calls_made: number;
  first_activity_at: string | null;
  last_activity_at: string | null;
  created_at: string;
  updated_at: string;
  // Computed attributes
  display_name_with_fallback?: string;
  full_name?: string;
}

/**
 * Create contact request
 */
export interface CreateContactRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  display_name?: string;
  bio?: string;
  avatar?: string;
  custom_fields?: Record<string, any>;
  role?: ContactRole;
  is_agent?: boolean;
  agent_specialty?: string;
  requires_approval?: boolean;
}

/**
 * Update contact request
 */
export interface UpdateContactRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  display_name?: string;
  bio?: string;
  avatar?: string;
  custom_fields?: Record<string, any>;
  role?: ContactRole;
  is_active?: boolean;
  is_agent?: boolean;
  agent_specialty?: string;
  email_notifications?: boolean;
  push_notifications?: boolean;
  sms_notifications?: boolean;
  notification_preferences?: Record<string, any>;
}

/**
 * Contact filters
 */
export interface ContactFilters {
  role?: ContactRole;
  is_active?: boolean;
  is_online?: boolean;
  is_agent?: boolean;
  approval_status?: ApprovalStatus;
  search?: string;
  page?: number;
  per_page?: number;
}

/**
 * Update online status request
 */
export interface UpdateOnlineStatusRequest {
  is_online: boolean;
}

