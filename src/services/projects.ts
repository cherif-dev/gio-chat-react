import { getApiClient } from './api';
import { Project, ProjectPublicInfo, ProjectStats, ApiResponse } from '../types';

/**
 * Project service for managing projects
 */
export class ProjectService {
  /**
   * Get public project information
   */
  static async getPublicInfo(): Promise<ApiResponse<ProjectPublicInfo>> {
    const client = getApiClient();
    return client.get<ProjectPublicInfo>(`/projects/info`);
  }

  /**
   * Get current project details
   */
  static async getProject(): Promise<ApiResponse<Project>> {
    const client = getApiClient();

    return client.get<Project>(``);
  }

  /**
   * Update project
   */
  static async updateProject(data: Partial<Project>): Promise<ApiResponse<Project>> {
    const client = getApiClient();

    return client.put<Project>(``, data);
  }

  /**
   * Get project statistics
   */
  static async getProjectStats(): Promise<ApiResponse<ProjectStats>> {
    const client = getApiClient();

    return client.get<ProjectStats>(`/stats`);
  }
}
