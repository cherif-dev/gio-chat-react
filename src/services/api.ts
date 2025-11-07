import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { ApiError, ApiResponse, PaginatedApiResponse, ProjectConfig } from '../types';
/**
 * Base API client class
 */
export class ApiClient {
  private client: AxiosInstance;
  private projectConfig: ProjectConfig;

  constructor(projectConfig: ProjectConfig) {
    this.projectConfig = projectConfig;
    // Create axios instance with base configuration
    this.client = axios.create({
      baseURL: `${projectConfig.url}`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-API-Key': projectConfig.key,
      },
    });

    // Add request interceptor
    this.client.interceptors.request.use(
      config => {
        return config;
      },
      error => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Add response interceptor
    this.client.interceptors.response.use(
      response => response,
      error => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Handle API errors
   */
  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const data: any = error.response.data;
      return {
        message: data?.message || error.message,
        errors: data?.errors,
        status: error.response.status,
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        message: 'No response received from server',
        status: 0,
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        message: error.message,
      };
    }
  }

  /**
   * Get project slug
   */
  public getProjectUrl(): string {
    return this.projectConfig.url;
  }

  /**
   * Make a GET request
   */
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * Make a POST request
   */
  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * Make a PUT request
   */
  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * Make a PATCH request
   */
  public async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * Make a DELETE request
   */
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * Make a GET request with pagination
   */
  public async getPaginated<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<PaginatedApiResponse<T>> {
    const response = await this.client.get<PaginatedApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * Health check
   */
  public async healthCheck() {
    return this.get('/health');
  }
}

// Singleton instance
let apiClientInstance: ApiClient | null = null;

/**
 * Initialize the API client
 */
export function initializeApiClient(config: ProjectConfig): ApiClient {
  apiClientInstance = new ApiClient(config);
  return apiClientInstance;
}

/**
 * Get the API client instance
 */
export function getApiClient(): ApiClient {
  if (!apiClientInstance) {
    throw new Error('API client not initialized. Call initializeApiClient() with config first.');
  }
  return apiClientInstance;
}

/**
 * Set the API client instance
 */
export function setApiClient(client: ApiClient) {
  apiClientInstance = client;
}
