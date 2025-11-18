export interface Shift {
    // id optional when creating
    id?: number;
    driver_id: number;
    motorcycle_id: number;
    // backend sends ISO strings; accept string or Date
    start_time?: string | Date;
    end_time?: string | Date | null;
    // flexible status to avoid mismatches; normalize in service if needed
    status?: string;
    created_at?: string | Date;

    // include related objects if returned by backend
    driver?: any;
    motorcycle?: any;

    // allow extra backend fields
    [key: string]: any;
}