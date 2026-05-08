interface ProductVariant {
    id: string;
    product_id: string;
    sku: string;
    name: string;
    shade: string | null;
    size: string;
    price: number;
    sale_price: number | null;
    stock: number;
    image_url: string;
    is_default: boolean;
}

interface Product {
    id: string;
    category_id: string;
    name: string;
    slug: string;
    brand: string;
    description: string;
    images: string[];
    tags: string[];
    base_price: number;
    is_active: boolean;
    is_featured: boolean;
    rating: number;
    review_count: number;
    created_at: string;
    updated_at: string;
    category_name: string;
    variants: ProductVariant[];
}

export type { Product, ProductVariant };