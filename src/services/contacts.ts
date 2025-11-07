import { getApiClient } from './api';
import {
  Contact,
  CreateContactRequest,
  UpdateContactRequest,
  ContactFilters,
  UpdateOnlineStatusRequest,
  PaginatedApiResponse,
  ApiResponse,
} from '../types';

/**
 * Contact service for managing contacts
 */
export class ContactService {
  /**
   * Get all contacts for a project
   */
  static async getContacts(filters?: ContactFilters): Promise<PaginatedApiResponse<Contact>> {
    const client = getApiClient();
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const url = `/contacts${params.toString() ? `?${params.toString()}` : ''}`;
    return client.getPaginated<Contact>(url);
  }

  /**
   * Get a single contact by UUID
   */
  static async getContact(uuid: string): Promise<ApiResponse<Contact>> {
    const client = getApiClient();

    return client.get<Contact>(`/contacts/${uuid}`);
  }

  /**
   * Create a new contact
   */
  static async createContact(data: CreateContactRequest): Promise<ApiResponse<Contact>> {
    const client = getApiClient();

    return client.post<Contact>(`/contacts`, data);
  }

  /**
   * Update a contact
   */
  static async updateContact(
    uuid: string,
    data: UpdateContactRequest
  ): Promise<ApiResponse<Contact>> {
    const client = getApiClient();

    return client.put<Contact>(`/contacts/${uuid}`, data);
  }

  /**
   * Delete a contact
   */
  static async deleteContact(uuid: string): Promise<ApiResponse<void>> {
    const client = getApiClient();

    return client.delete<void>(`/contacts/${uuid}`);
  }

  /**
   * Approve a contact
   */
  static async approveContact(uuid: string): Promise<ApiResponse<Contact>> {
    const client = getApiClient();

    return client.post<Contact>(`/contacts/${uuid}/approve`);
  }

  /**
   * Reject a contact
   */
  static async rejectContact(uuid: string): Promise<ApiResponse<Contact>> {
    const client = getApiClient();

    return client.post<Contact>(`/contacts/${uuid}/reject`);
  }

  /**
   * Update contact online status
   */
  static async updateOnlineStatus(
    uuid: string,
    data: UpdateOnlineStatusRequest
  ): Promise<ApiResponse<Contact>> {
    const client = getApiClient();

    return client.post<Contact>(`/contacts/${uuid}/online`, data);
  }
}
