import { apiClient } from './api';

export interface Organization {
  id: number;
  name: string;
  slug: string;
  primary_color: string;
  logo_url: string | null;
  created_at: string;
}

export interface Prize {
  id: number;
  place: number;
  name: string;
  description: string | null;
  image_url: string | null;
  link: string | null;
  organization_id: number;
}

export const organizationService = {
  /**
   * Get public organization details by slug
   */
  getPublicOrg: async (slug: string): Promise<Organization> => {
    const response = await apiClient.get<Organization>(`/organizations/public/${slug}`);
    return response.data;
  },

  /**
   * Get public prizes for an organization by slug
   */
  getPublicPrizes: async (slug: string): Promise<Prize[]> => {
    const response = await apiClient.get<Prize[]>(`/organizations/public/${slug}/prizes`);
    return response.data;
  },

  /**
   * Get current user's organization (authenticated)
   */
  getMyOrg: async (): Promise<Organization> => {
    const response = await apiClient.get<Organization>('/organizations/me');
    return response.data;
  },

  /**
   * Update current organization
   */
  updateMyOrg: async (data: Partial<Organization>): Promise<Organization> => {
    const response = await apiClient.put<Organization>('/organizations/me', data);
    return response.data;
  },

  /**
   * Get current user's organization prizes
   */
  getMyPrizes: async (): Promise<Prize[]> => {
    const response = await apiClient.get<Prize[]>('/organizations/me/prizes');
    return response.data;
  },

  /**
   * Create a new prize
   */
  createPrize: async (data: Omit<Prize, 'id' | 'organization_id'>): Promise<Prize> => {
    const response = await apiClient.post<Prize>('/organizations/me/prizes', data);
    return response.data;
  },

  /**
   * Update a prize
   */
  updatePrize: async (id: number, data: Partial<Prize>): Promise<Prize> => {
    const response = await apiClient.put<Prize>(`/organizations/me/prizes/${id}`, data);
    return response.data;
  },

  /**
   * Delete a prize
   */
  deletePrize: async (id: number): Promise<void> => {
    await apiClient.delete(`/organizations/me/prizes/${id}`);
  }
};
