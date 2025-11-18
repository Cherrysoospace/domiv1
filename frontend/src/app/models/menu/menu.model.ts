export interface Menu {
    // id optional when creating
    id?: number;
    restaurant_id: number;
    product_id: number;
    price: number;
    // availability may be omitted on create
    availability?: boolean;
    // backend returns ISO string; accept string or Date
    created_at?: string | Date;
    // include nested relations if backend returns them
    product?: any;
    restaurant?: any;

    // allow extra backend fields
    [key: string]: any;
}
