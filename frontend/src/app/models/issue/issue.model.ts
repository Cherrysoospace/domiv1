export interface Issue {
    id: number;
    motorcycle_id: number;
    description: Text;
    issue_type: string;
    date_reported: Date;
    status: string;
    created_at: Date;
}
