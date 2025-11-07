import { getApiClient } from './api';
import {
  Conversation,
  CreateConversationRequest,
  UpdateConversationRequest,
  ConversationFilters,
  AssignConversationRequest,
  UpdateConversationStatusRequest,
  PaginatedApiResponse,
  ApiResponse,
} from '../types';

/**
 * Conversation service for managing conversations
 */
export class ConversationService {
  /**
   * Get all conversations for a contact
   */
  static async getConversations(
    contactUuid: string,
    filters?: ConversationFilters
  ): Promise<PaginatedApiResponse<Conversation>> {
    const client = getApiClient();
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const url = `/contacts/${contactUuid}/conversations${
      params.toString() ? `?${params.toString()}` : ''
    }`;
    return client.getPaginated<Conversation>(url);
  }

  /**
   * Get a specific conversation between two participants
   */
  static async getConversation(
    contactUuid: string,
    participantUuid: string
  ): Promise<ApiResponse<Conversation>> {
    const client = getApiClient();
    return client.get<Conversation>(`/chat/${contactUuid}/${participantUuid}`);
  }

  /**
   * Get a conversation by ID
   */
  static async getConversationById(
    contactUuid: string,
    conversationId: number
  ): Promise<ApiResponse<Conversation>> {
    const client = getApiClient();
    return client.get<Conversation>(`/contacts/${contactUuid}/conversations/${conversationId}`);
  }

  /**
   * Create a new conversation
   */
  static async createConversation(
    contactUuid: string,
    data: CreateConversationRequest
  ): Promise<ApiResponse<Conversation>> {
    const client = getApiClient();
    return client.post<Conversation>(`/contacts/${contactUuid}/conversations`, data);
  }

  /**
   * Update a conversation
   */
  static async updateConversation(
    contactUuid: string,
    conversationId: number,
    data: UpdateConversationRequest
  ): Promise<ApiResponse<Conversation>> {
    const client = getApiClient();
    return client.put<Conversation>(
      `/contacts/${contactUuid}/conversations/${conversationId}`,
      data
    );
  }

  /**
   * Delete a conversation
   */
  static async deleteConversation(
    contactUuid: string,
    conversationId: number
  ): Promise<ApiResponse<void>> {
    const client = getApiClient();
    return client.delete<void>(`/contacts/${contactUuid}/conversations/${conversationId}`);
  }

  /**
   * Assign conversation to a contact
   */
  static async assignConversation(
    contactUuid: string,
    conversationId: number,
    data: AssignConversationRequest
  ): Promise<ApiResponse<Conversation>> {
    const client = getApiClient();
    return client.post<Conversation>(
      `/contacts/${contactUuid}/conversations/${conversationId}/assign`,
      data
    );
  }

  /**
   * Unassign conversation
   */
  static async unassignConversation(
    contactUuid: string,
    conversationId: number
  ): Promise<ApiResponse<Conversation>> {
    const client = getApiClient();
    return client.post<Conversation>(
      `/contacts/${contactUuid}/conversations/${conversationId}/unassign`
    );
  }

  /**
   * Update conversation status
   */
  static async updateConversationStatus(
    contactUuid: string,
    conversationId: number,
    data: UpdateConversationStatusRequest
  ): Promise<ApiResponse<Conversation>> {
    const client = getApiClient();
    return client.post<Conversation>(
      `/contacts/${contactUuid}/conversations/${conversationId}/status`,
      data
    );
  }

  /**
   * Pin conversation
   */
  static async pinConversation(
    contactUuid: string,
    conversationId: number
  ): Promise<ApiResponse<Conversation>> {
    const client = getApiClient();
    return client.post<Conversation>(
      `/contacts/${contactUuid}/conversations/${conversationId}/pin`
    );
  }

  /**
   * Unpin conversation
   */
  static async unpinConversation(
    contactUuid: string,
    conversationId: number
  ): Promise<ApiResponse<Conversation>> {
    const client = getApiClient();
    return client.post<Conversation>(
      `/contacts/${contactUuid}/conversations/${conversationId}/unpin`
    );
  }

  /**
   * Star conversation
   */
  static async starConversation(
    contactUuid: string,
    conversationId: number
  ): Promise<ApiResponse<Conversation>> {
    const client = getApiClient();
    return client.post<Conversation>(
      `/contacts/${contactUuid}/conversations/${conversationId}/star`
    );
  }

  /**
   * Unstar conversation
   */
  static async unstarConversation(
    contactUuid: string,
    conversationId: number
  ): Promise<ApiResponse<Conversation>> {
    const client = getApiClient();
    return client.post<Conversation>(
      `/contacts/${contactUuid}/conversations/${conversationId}/unstar`
    );
  }

  /**
   * Archive conversation
   */
  static async archiveConversation(
    contactUuid: string,
    conversationId: number
  ): Promise<ApiResponse<Conversation>> {
    const client = getApiClient();
    return client.post<Conversation>(
      `/contacts/${contactUuid}/conversations/${conversationId}/archive`
    );
  }

  /**
   * Unarchive conversation
   */
  static async unarchiveConversation(
    contactUuid: string,
    conversationId: number
  ): Promise<ApiResponse<Conversation>> {
    const client = getApiClient();
    return client.post<Conversation>(
      `/contacts/${contactUuid}/conversations/${conversationId}/unarchive`
    );
  }
}
