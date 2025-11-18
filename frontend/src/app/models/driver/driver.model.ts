export interface Driver {
    // Optional on create
    id?: number;
    name: string;
    license_number: string;
    phone: string;
    // backend may return null for email
    email?: string | null;
    // use a flexible status type to avoid mismatches with backend values
    status?: string;
    // backend sends ISO strings; allow string or Date so services can choose how to parse
    created_at?: string | Date;

    // allow extra properties from backend without causing type errors
    [key: string]: any;
}
