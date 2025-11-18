export interface Order {
    // id optional when creating
    id?: number;
    customer_id: number;
    menu_id: number;
    motorcycle_id?: number | null;
    quantity: number;
    total_price: number;
    // allow flexible status string to avoid mismatches; normalize in service if needed
    status?: string;
    // backend returns ISO strings; accept string or Date
    created_at?: string | Date;

    // nested relations returned by backend
    address?: any;
    customer?: any;
    menu?: any;

    // allow extra backend fields
    [key: string]: any;
}
