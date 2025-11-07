import { GlobalConfig, ApiConfig, SupabaseConfig, ProjectConfig } from '../types';

/**
 * Configuration validation error
 */
export class ConfigValidationError extends Error {
  constructor(message: string) {
    super(`Configuration validation error: ${message}`);
    this.name = 'ConfigValidationError';
  }
}

/**
 * Configuration service for managing application settings
 */
class ConfigService {
  private projectConfig: ProjectConfig | null = null;
  private config: GlobalConfig | null = null;
  private isInitialized = false;

  constructor(projectConfig: ProjectConfig) {
    this.projectConfig = projectConfig;
  }
  /**
   * Initialize the configuration service
   * @param config - The global configuration object
   */
  async initialize(projectConfig: ProjectConfig): Promise<void> {
    this.projectConfig = projectConfig;
    const config = await this.fetchConfig();
    this.validateConfig(config);
    this.config = config;
    this.isInitialized = true;
  }

  private async fetchConfig(): Promise<GlobalConfig> {
    if (!this.projectConfig) {
      throw new Error('Project configuration not initialized. Call initialize() first.');
    }
    const response = await fetch(`${this.projectConfig?.url}/config`, {
      headers: {
        'X-API-Key': this.projectConfig?.key,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch config');
    }
    return response.json();
  }

  /**
   * Get the current configuration
   * @returns The current configuration
   * @throws ConfigValidationError if not initialized
   */
  getConfig(): GlobalConfig {
    if (!this.isInitialized || !this.config) {
      throw new ConfigValidationError(
        'Configuration service not initialized. Call initialize() first.'
      );
    }
    return this.config;
  }

  /**
   * Get API configuration
   * @returns API configuration
   */
  getApiConfig(): ApiConfig {
    return this.getConfig().api;
  }

  /**
   * Get Supabase configuration
   * @returns Supabase configuration
   */
  getSupabaseConfig(): SupabaseConfig {
    return this.getConfig().supabase;
  }

  /**
   * Check if the service is initialized
   * @returns True if initialized
   */
  isServiceInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Validate configuration object
   * @param config - Configuration to validate
   * @throws ConfigValidationError if validation fails
   */
  private validateConfig(config: GlobalConfig): void {
    const errors: string[] = [];

    // Validate Supabase config
    if (!config.supabase) {
      errors.push('Supabase configuration is required');
    } else {
      if (!config.supabase.url) {
        errors.push('Supabase URL is required');
      }
      if (!config.supabase.anon_key) {
        errors.push('Supabase anon_key is required');
      }
    }

    if (errors.length > 0) {
      throw new ConfigValidationError(errors.join(', '));
    }
  }

  /**
   * Reset the configuration service (useful for testing)
   */
  reset(): void {
    this.config = null;
    this.isInitialized = false;
  }
}

// Singleton instance
let configServiceInstance: ConfigService | null = null;

/**
 * Initialize the API client
 */
export async function initializeConfigService(config: ProjectConfig): Promise<ConfigService> {
  configServiceInstance = new ConfigService(config);
  await configServiceInstance.initialize(config);
  return configServiceInstance;
}

/**
 * Get the API client instance
 */
export function getConfigService(): ConfigService {
  console.log('getConfigService', configServiceInstance);
  if (!configServiceInstance) {
    throw new Error(
      'Config service not initialized. Call initializeConfigService() with config first.'
    );
  }
  return configServiceInstance;
}
