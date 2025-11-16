export interface Photo {
    id: number;
    issue_id: number;
    image_url: String;
    caption?: String;
    taken_at?: Date;
    created_at: Date;
}
