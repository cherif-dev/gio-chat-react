/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}

/**
 * Paginated API response
 */
export interface PaginatedApiResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

/**
 * API error response
 */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}
/**
 * Project config interface
 */
export interface ProjectConfig {
  url: string;
  key: string;
}
/**
 * API config interface
 */
export interface ApiConfig {
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * Supabase configuration interface
 */
export interface SupabaseConfig {
  url: string;
  anon_key: string;
  schema?: string;
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

/**
 * Global configuration interface
 */
export interface GlobalConfig {
  api: ApiConfig;
  supabase: SupabaseConfig;
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  version: string;
  service: string;
}
