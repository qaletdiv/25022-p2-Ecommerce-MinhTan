import Link from "next/link";
import { Product } from "../types/product";
import { Category } from "../types/category";
import ProductCard from "../components/productCard";
import ProductFilters from "../components/ProductFilters";
import { Suspense } from "react";

const PAGE_SIZE = 8;

type Params = {
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
};

export default async function SanPham({ searchParams }: { searchParams: Promise<Params> }) {
    const { q, category, minPrice, maxPrice, sort, page } = await searchParams;

    const [productsRes, categoriesRes] = await Promise.all([
        fetch('http://localhost:3000/api/products'),
        fetch('http://localhost:3000/api/categories'),
    ]);
    const allProducts: Product[] = await productsRes.json();
    const categories: Category[] = await categoriesRes.json();

    // Filter
    let filtered = allProducts;
    if (q) {
        const lq = q.toLowerCase();
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(lq) ||
            p.brand.toLowerCase().includes(lq) ||
            (p.tags ?? []).some(t => t.toLowerCase().includes(lq))
        );
    }
    if (category) filtered = filtered.filter(p => p.category_id === category);
    if (minPrice) filtered = filtered.filter(p => p.base_price >= Number(minPrice));
    if (maxPrice) filtered = filtered.filter(p => p.base_price <= Number(maxPrice));

    // Sort
    if (sort === 'price_asc') filtered = [...filtered].sort((a, b) => a.base_price - b.base_price);
    else if (sort === 'price_desc') filtered = [...filtered].sort((a, b) => b.base_price - a.base_price);
    else if (sort === 'name_asc') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'vi'));

    // Pagination
    const totalCount = filtered.length;
    const currentPage = Math.max(1, Number(page ?? 1));
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const buildPageUrl = (p: number) => {
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        if (category) params.set('category', category);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (sort) params.set('sort', sort);
        if (p > 1) params.set('page', String(p));
        const qs = params.toString();
        return `/sanpham${qs ? '?' + qs : ''}`;
    };

    return (
        <div className="py-8">
            <div className="flex flex-col items-center">
                <h4 className="text-3xl font-bold mb-2 text-pink-700 px-4 text-center">
                    {q ? `Kết quả: "${q}"` : 'Tất cả sản phẩm'}
                </h4>
                <p className="text-sm text-gray-400 mb-6">
                    {totalCount} sản phẩm {q ? 'tìm thấy' : ''}
                </p>

                {/* Filters — needs Suspense because useSearchParams inside */}
                <Suspense>
                    <ProductFilters categories={categories} total={totalCount} />
                </Suspense>

                {paginated.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl px-4">
                            {paginated.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center gap-1.5 mt-10">
                                <Link
                                    href={buildPageUrl(currentPage - 1)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                                        currentPage <= 1
                                            ? 'border-gray-100 text-gray-300 pointer-events-none'
                                            : 'border-gray-200 text-gray-600 hover:bg-pink-50 hover:border-pink-200'
                                    }`}
                                >
                                    ‹
                                </Link>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <Link
                                        key={p}
                                        href={buildPageUrl(p)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                                            p === currentPage
                                                ? 'bg-pink-500 border-pink-500 text-white'
                                                : 'border-gray-200 text-gray-600 hover:bg-pink-50 hover:border-pink-200'
                                        }`}
                                    >
                                        {p}
                                    </Link>
                                ))}
                                <Link
                                    href={buildPageUrl(currentPage + 1)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                                        currentPage >= totalPages
                                            ? 'border-gray-100 text-gray-300 pointer-events-none'
                                            : 'border-gray-200 text-gray-600 hover:bg-pink-50 hover:border-pink-200'
                                    }`}
                                >
                                    ›
                                </Link>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-3 py-16 text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                        </svg>
                        <p className="text-base">Không tìm thấy sản phẩm phù hợp</p>
                        <Link href="/sanpham" className="text-sm text-pink-500 hover:underline">Xem tất cả sản phẩm</Link>
                    </div>
                )}
            </div>
        </div>
    );
}