export interface Motorcycle {
    // id optional when creating
    id?: number;
    license_plate: string;
    brand: string;
    year: number;
    // allow nullable/optional email-like status strings from backend
    status?: string;
    // backend sends ISO string; accept string or Date
    created_at?: string | Date;

    // allow extra backend fields without breaking typing
    [key: string]: any;
}
