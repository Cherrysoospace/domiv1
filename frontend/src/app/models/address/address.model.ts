export interface Address {
    // id is optional on create
    id?: number;
    order_id: number;
    street: string;
    city: string;
    state: string;
    postal_code: string;
    // additional_info can be string or null
    additional_info?: string | null;
    // backend returns created_at as ISO string; keep as string here
    created_at?: string;
}
