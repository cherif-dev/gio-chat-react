import { ApiClient, getApiClient } from './api';
import {
  Message,
  CreateMessageRequest,
  UpdateMessageRequest,
  MessageFilters,
  PaginatedApiResponse,
  ApiResponse,
} from '../types';

/**
 * Message service for managing messages
 */
export class MessageService {
  static apiClient: ApiClient | undefined = undefined;

  static setApiClient(client: ApiClient) {
    this.apiClient = client;
  }

  /**
   * Get all messages for a conversation
   */
  static async getMessages(
    conversationUuid: string,
    filters?: MessageFilters
  ): Promise<PaginatedApiResponse<Message>> {
    const client = getApiClient();

    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const url = `/chat/${conversationUuid}/messages${
      params.toString() ? `?${params.toString()}` : ''
    }`;
    return client.getPaginated<Message>(url);
  }

  /**
   * Get a single message by ID
   */
  static async getMessage(
    conversationUuid: string,
    message_uuid: string
  ): Promise<ApiResponse<Message>> {
    const client = getApiClient();

    return client.get<Message>(`/chat/${conversationUuid}/messages/${message_uuid}`);
  }

  /**
   * Create a new message
   */
  static async createMessage(
    conversationUuid: string,
    data: CreateMessageRequest
  ): Promise<ApiResponse<Message>> {
    const client = getApiClient();

    return client.post<Message>(`/chat/${conversationUuid}/messages`, data);
  }

  /**
   * Update a message
   */
  static async updateMessage(
    conversationUuid: string,
    message_uuid: string,
    data: UpdateMessageRequest
  ): Promise<ApiResponse<Message>> {
    const client = getApiClient();

    return client.put<Message>(`/chat/${conversationUuid}/messages/${message_uuid}`, data);
  }

  /**
   * Delete a message
   */
  static async deleteMessage(
    conversationUuid: string,
    messageId: number
  ): Promise<ApiResponse<void>> {
    const client = getApiClient();

    return client.delete<void>(`/chat/${conversationUuid}/messages/${messageId}`);
  }

  /**
   * Mark message as read
   */
  static async markAsRead(
    conversationUuid: string,
    messageId: number
  ): Promise<ApiResponse<Message>> {
    const client = getApiClient();

    return client.post<Message>(`/chat/${conversationUuid}/messages/${messageId}/read`);
  }

  /**
   * Mark message as delivered
   */
  static async markAsDelivered(
    conversationUuid: string,
    messageId: number
  ): Promise<ApiResponse<Message>> {
    const client = getApiClient();

    return client.post<Message>(`/chat/${conversationUuid}/messages/${messageId}/delivered`);
  }
}
