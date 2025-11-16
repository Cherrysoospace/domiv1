export interface Driver {
    id: number;
    name: string;
    license_number: string;
    phone: string;
    email?: string;
    status: 'active' | 'inactive' | 'suspended';
    created_at: Date;
}
