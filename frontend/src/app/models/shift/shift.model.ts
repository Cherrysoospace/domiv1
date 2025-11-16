export interface Shift {
    id: number;
    driver_id: number;
    motorcycle_id: number;
    start_time: Date;
    end_time?: Date;
    status: 'active' | 'completed' | 'cancelled';
    created_at: Date;
}