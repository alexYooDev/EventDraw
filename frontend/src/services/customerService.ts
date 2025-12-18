/**
 * Customer API service
 * Handles all API requests related to customers
 */

import { apiClient } from './api';
import type {
    Customer,
    CustomerCreate,
    CustomerUpdate,
    CustomerListResponse,
} from '../types/customer';

export const customerService = {
    /** 
     * Create a new customer
    */
    create: async (data: CustomerCreate): Promise<Customer> => {
        const response = await apiClient.post<Customer>('/customers/', data);
        return response.data;
    },

    /** 
     * GET all customers with pagination
    */
    getAll: async (skip: number = 0, limit: number = 100): Promise<CustomerListResponse> => {
        const response = await apiClient.get<CustomerListResponse>('/customers/', {
            params: {skip, limit}
        });
        return response.data;
    },
    /**
     * GET a single customer by ID
     */
    getById: async (id: number): Promise<Customer> => {
        const response = await apiClient.get<Customer>(`/customers/${id}`);
        return response.data;
    },

    /**
     * Update a customer
     */
    update: async (id: number, data: CustomerUpdate): Promise<Customer> => {
        const response = await apiClient.put<Customer>(`/customers/${id}`, data);
        return response.data
    },
    /**
     * Delete a customer
     */
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/customers/${id}`);
    },

    /**
     * Get a random customer who hasn't won yet
     */
    getRandomWinner: async (): Promise<Customer> => {
        const response = await apiClient.get<Customer>('/customers/winner/random');
        return response.data;
    },
    /**
     * Mark a customer as winner
     */
    markAsWinner: async(id: number, winnerPlace: number): Promise<Customer> => {
        const response = await apiClient.post<Customer>(`/customers/${id}/mark-winner`, null, {
            params: { winner_place: winnerPlace }
        });
        return response.data;
    },

    /**
     * Send winner notification
     */
    notifyWinner: async(customerId: number, sendImmediately: boolean = true): Promise<{ success: boolean; message: string; email_sent_to?: string }> => {
        const response = await apiClient.post('/customers/notify-winner', {
            customer_id: customerId,
            send_immediately: sendImmediately
        });
        return response.data;
    }
}