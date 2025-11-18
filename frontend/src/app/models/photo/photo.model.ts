export interface Photo {
    // id optional when creating
    id?: number;
    issue_id: number;
    // use lowercase string types
    image_url: string;
    // caption optional and may be null
    caption?: string | null;
    // taken_at may be ISO string or Date
    taken_at?: string | Date;
    // created_at may be ISO string or Date
    created_at?: string | Date;

    // allow extra backend fields
    [key: string]: any;
}
