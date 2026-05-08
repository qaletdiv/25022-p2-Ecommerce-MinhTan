interface Category {
    id: string;
    name: string;
    slug: string;
    parent_id: string | null;
    image_url: string;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export type { Category };