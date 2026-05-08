'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

type Category = { id: string; name: string };

const PRICE_RANGES = [
    { label: 'Tất cả', min: '', max: '' },
    { label: 'Dưới 200.000đ', min: '', max: '200000' },
    { label: '200.000 – 500.000đ', min: '200000', max: '500000' },
    { label: '500.000 – 1.000.000đ', min: '500000', max: '1000000' },
    { label: 'Trên 1.000.000đ', min: '1000000', max: '' },
];

const SORT_OPTIONS = [
    { value: '', label: 'Mặc định' },
    { value: 'price_asc', label: 'Giá: Thấp → Cao' },
    { value: 'price_desc', label: 'Giá: Cao → Thấp' },
    { value: 'name_asc', label: 'Tên: A → Z' },
];

export default function ProductFilters({
    categories,
    total,
}: {
    categories: Category[];
    total: number;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const current = {
        q: searchParams.get('q') ?? '',
        category: searchParams.get('category') ?? '',
        minPrice: searchParams.get('minPrice') ?? '',
        maxPrice: searchParams.get('maxPrice') ?? '',
        sort: searchParams.get('sort') ?? '',
    };

    const update = useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
            params.delete('page'); // reset to page 1 on filter change
            router.push(`/sanpham?${params.toString()}`);
        },
        [router, searchParams]
    );

    const setPriceRange = (min: string, max: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (min) params.set('minPrice', min); else params.delete('minPrice');
        if (max) params.set('maxPrice', max); else params.delete('maxPrice');
        params.delete('page');
        router.push(`/sanpham?${params.toString()}`);
    };

    const clearAll = () => {
        const params = new URLSearchParams();
        if (current.q) params.set('q', current.q);
        router.push(`/sanpham?${params.toString()}`);
    };

    const hasFilters = current.category || current.minPrice || current.maxPrice || current.sort;

    const activePriceRange = PRICE_RANGES.find(
        r => r.min === current.minPrice && r.max === current.maxPrice
    ) ?? PRICE_RANGES[0];

    return (
        <div className="w-full max-w-6xl px-4 mx-auto mb-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Category filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-gray-500 whitespace-nowrap">Danh mục</label>
                        <select
                            value={current.category}
                            onChange={e => update('category', e.target.value)}
                            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 bg-white text-gray-700"
                        >
                            <option value="">Tất cả</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Price range filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-gray-500 whitespace-nowrap">Khoảng giá</label>
                        <select
                            value={`${activePriceRange.min}|${activePriceRange.max}`}
                            onChange={e => {
                                const [min, max] = e.target.value.split('|');
                                setPriceRange(min, max);
                            }}
                            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 bg-white text-gray-700"
                        >
                            {PRICE_RANGES.map(r => (
                                <option key={r.label} value={`${r.min}|${r.max}`}>{r.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-gray-500 whitespace-nowrap">Sắp xếp</label>
                        <select
                            value={current.sort}
                            onChange={e => update('sort', e.target.value)}
                            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 bg-white text-gray-700"
                        >
                            {SORT_OPTIONS.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Result count + clear */}
                    <div className="ml-auto flex items-center gap-3">
                        <span className="text-xs text-gray-400">{total} sản phẩm</span>
                        {hasFilters && (
                            <button
                                onClick={clearAll}
                                className="text-xs text-pink-500 font-medium hover:text-pink-700 transition-colors"
                            >
                                ✕ Xoá bộ lọc
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
