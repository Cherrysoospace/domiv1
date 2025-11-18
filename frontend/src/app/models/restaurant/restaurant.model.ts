export interface Restaurant {
    // id optional when creating
    id?: number;
    name: string;
    address: string;
    phone: string;
    // email may be null in backend
    email?: string | null;
    // backend returns ISO string; accept string or Date
    created_at?: string | Date;

    // allow extra backend fields
    [key: string]: any;
}
