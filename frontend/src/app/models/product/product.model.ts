export interface Product {
    // id optional when creating
    id?: number;
    name: string;
    // description can be nullable according to backend
    description?: string | null;
    price: number;
    category?: string | null;
    // backend returns ISO string; accept string or Date
    created_at?: string | Date;

    // allow extra backend fields without breaking typing
    [key: string]: any;
}

