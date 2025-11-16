export interface Order {
    id: number;
    customer_id: number;
    menu_id: number;
    motorcycle_id?: number;
    quantity: number;
    total_price: number;
    status: 'pending' | 'in_progress' | 'delivered' | 'cancelled';
    created_at: Date;
}
