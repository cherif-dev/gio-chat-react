// No imports needed for this file

/**
 * Project interface
 */
export interface Project {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  logo: string | null;
  settings: Record<string, any> | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Project public info interface
 */
export interface ProjectPublicInfo {
  slug: string;
  name: string;
  logo: string | null;
  description: string | null;
}

/**
 * Project stats interface
 */
export interface ProjectStats {
  total_contacts: number;
  total_conversations: number;
  total_messages: number;
  active_conversations: number;
  pending_conversations: number;
  online_contacts: number;
  total_agents: number;
}
