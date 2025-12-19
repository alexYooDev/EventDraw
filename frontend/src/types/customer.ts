/* 
 TypeScript types for Customer data
 These match the backend Pydantic schemas
*/

export interface Customer {
    id: number;
    name: string;
    email: string;
    feedback: string;
    is_winner: boolean;
    is_notified: boolean;
    notified_at: string | null;
    winner_place: number | null;
    created_at: string;
    updated_at: string | null;
}

export interface CustomerCreate {
    name: string;
    email: string;
    feedback: string;
    organization_slug: string;
}

export interface CustomerUpdate {
    name?: string;
    email?: string;
    feedback?: string;
    is_winner?: boolean;
}

export interface CustomerListResponse {
    total: number;
    customers: Customer[];
}
