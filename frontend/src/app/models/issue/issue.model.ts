export interface Issue {
    // id optional when creating
    id?: number;
    motorcycle_id: number;
    // use string for description (Text is not a TS type)
    description: string;
    issue_type: string;
    // backend returns ISO strings; accept string or Date
    date_reported?: string | Date;
    status?: string;
    // created_at may be ISO string or Date
    created_at?: string | Date;
    // photos is returned by backend (may be empty array)
    photos?: any[];

    // allow extra backend fields without breaking the model
    [key: string]: any;
}
