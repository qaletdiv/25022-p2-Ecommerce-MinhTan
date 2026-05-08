'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ProductVariant } from '../types/product';
import { addToCart } from '../redux/slices/cart.slice';
import { useDispatch } from 'react-redux';

type ProductInfoSectionProps = {
    product: Product;
};

const ProductInfoSection = ({ product }: ProductInfoSectionProps) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const defaultVariant = product.variants?.find(v => v.is_default) || product.variants?.[0];
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(defaultVariant);
    const [quantity, setQuantity] = useState(1);

    const displayPrice = selectedVariant?.sale_price ?? selectedVariant?.price ?? product.base_price;
    const originalPrice = selectedVariant?.price ?? product.base_price;
    const hasDiscount = selectedVariant?.sale_price && selectedVariant.sale_price < selectedVariant.price;

    return (
        <div className="space-y-6">
            <div className="rounded-3xl bg-white p-8 shadow-xl border border-pink-100">
                <span className="inline-flex items-center rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-pink-700">
                    {product.category_name}
                </span>
                <h1 className="mt-4 text-4xl font-bold text-pink-800">{product.name}</h1>
                <p className="mt-2 text-sm text-pink-600 uppercase tracking-[0.2em] font-medium">{product.brand}</p>

                <div className="mt-6 flex items-center gap-3">
                    <span className="rounded-full bg-pink-500 px-3 py-1 text-sm font-semibold text-white">
                        {product.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-600">{product.review_count} đánh giá</span>
                </div>

                <p className="mt-6 text-gray-700 leading-relaxed">{product.description}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-700">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Variant Selection */}
                {product.variants && product.variants.length > 0 && (
                    <div className="mt-8 border-t border-gray-200 pt-8">
                        <p className="text-sm font-semibold text-gray-700 mb-3">Chọn phiên bản:</p>
                        <div className="flex flex-wrap gap-2">
                            {product.variants.map((variant) => (
                                <button
                                    key={variant.id}
                                    onClick={() => setSelectedVariant(variant)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedVariant?.id === variant.id
                                        ? 'bg-pink-600 text-white ring-2 ring-pink-300'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {variant.name}
                                </button>
                            ))}
                        </div>

                        {selectedVariant && (
                            <div className="mt-4 p-4 bg-pink-50 rounded-2xl border border-pink-100">
                                <p className="text-xs text-gray-600">SKU: {selectedVariant.sku}</p>
                                <p className="text-sm text-gray-600 mt-1">Kho: {selectedVariant.stock} sản phẩm</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        {selectedVariant ? (
                            <>
                                <p className="text-sm text-gray-500">Giá</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold text-pink-700">{displayPrice?.toLocaleString('vi-VN')}₫</p>
                                    {hasDiscount && (
                                        <p className="text-sm text-gray-500 line-through">{originalPrice.toLocaleString('vi-VN')}₫</p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="text-sm text-gray-500">Giá tham khảo</p>
                                <p className="text-3xl font-bold text-pink-700">{product.base_price.toLocaleString('vi-VN')}₫</p>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center rounded-full border border-pink-200 bg-pink-50 overflow-hidden w-fit">
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className="px-3 py-2 text-pink-600 hover:bg-pink-100 transition text-lg font-bold"
                            >
                                −
                            </button>
                            <input
                                type="number"
                                min={1}
                                max={selectedVariant?.stock ?? undefined}
                                value={quantity}
                                onChange={e => setQuantity(Math.max(1, Math.min(Number(e.target.value), selectedVariant?.stock ?? Infinity)))}
                                className="w-12 text-center bg-transparent text-sm font-semibold text-gray-800 focus:outline-none"
                            />
                            <button
                                onClick={() => setQuantity(q => selectedVariant?.stock ? Math.min(q + 1, selectedVariant.stock) : q + 1)}
                                className="px-3 py-2 text-pink-600 hover:bg-pink-100 transition text-lg font-bold"
                            >
                                +
                            </button>
                        </div>
                        <button
                            onClick={() => {
                                if (!localStorage.getItem('user')) {
                                    router.push(`/login?from=${encodeURIComponent(window.location.pathname)}`);
                                    return;
                                }
                                dispatch(addToCart({ variantId: selectedVariant!.id, quantity }));
                            }}
                            disabled={selectedVariant && selectedVariant.stock === 0}
                            className={`inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold transition hover:scale-[1.02] ${selectedVariant?.stock === 0
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg hover:shadow-2xl'
                                }`}
                        >
                            {selectedVariant?.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Specifications / Details */}
            <div className="rounded-3xl bg-white p-8 shadow-xl border border-pink-100">
                <h2 className="text-lg font-bold text-pink-800 mb-5">Thông số & Chi tiết</h2>
                <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-100">
                        <tr className="py-2">
                            <td className="py-2.5 pr-4 text-gray-500 font-medium w-40">Thương hiệu</td>
                            <td className="py-2.5 text-gray-800">{product.brand}</td>
                        </tr>
                        <tr>
                            <td className="py-2.5 pr-4 text-gray-500 font-medium">Danh mục</td>
                            <td className="py-2.5 text-gray-800">{product.category_name}</td>
                        </tr>
                        {product.variants && product.variants.length > 0 && (
                            <tr>
                                <td className="py-2.5 pr-4 text-gray-500 font-medium">Dung tích / Size</td>
                                <td className="py-2.5 text-gray-800">
                                    {product.variants.map(v => v.size).filter(Boolean).join(', ')}
                                </td>
                            </tr>
                        )}
                        {product.variants?.some(v => v.shade) && (
                            <tr>
                                <td className="py-2.5 pr-4 text-gray-500 font-medium">Màu sắc</td>
                                <td className="py-2.5 text-gray-800">
                                    {product.variants.map(v => v.shade).filter(Boolean).join(', ')}
                                </td>
                            </tr>
                        )}
                        <tr>
                            <td className="py-2.5 pr-4 text-gray-500 font-medium">Đánh giá</td>
                            <td className="py-2.5 text-gray-800">
                                {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
                                {' '}<span className="text-gray-500">({product.rating.toFixed(1)} / {product.review_count} đánh giá)</span>
                            </td>
                        </tr>
                        {product.tags?.length > 0 && (
                            <tr>
                                <td className="py-2.5 pr-4 text-gray-500 font-medium">Tags</td>
                                <td className="py-2.5">
                                    <div className="flex flex-wrap gap-1.5">
                                        {product.tags.map(tag => (
                                            <span key={tag} className="bg-pink-50 text-pink-600 text-xs px-2.5 py-0.5 rounded-full border border-pink-100">{tag}</span>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductInfoSection;
