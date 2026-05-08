'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { removeFromCart, increaseQuantity, decreaseQuantity } from '../redux/slices/cart.slice';
import { Product, ProductVariant } from '../types/product';
import { CartItem } from '../types/cart';
import LoadingSpinner from '../components/LoadingSpinner';

type CartDisplayItem = {
    variantId: CartItem['variantId'];
    quantity: number;
    product: Product;
    variant: ProductVariant;
};

export default function GioHang() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state: any) => state.cart.items as CartItem[]);

    const [displayItems, setDisplayItems] = useState<CartDisplayItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Require login
    useEffect(() => {
        if (!localStorage.getItem('user')) {
            router.replace('/login?from=/giohang');
        }
    }, [router]);

    useEffect(() => {
        if (cartItems.length === 0) {
            setDisplayItems([]);
            setLoading(false);
            return;
        }

        const fetchProducts = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
                const products: Product[] = await res.json();

                const resolved: CartDisplayItem[] = [];
                for (const item of cartItems) {
                    for (const product of products) {
                        const variant = product.variants.find(
                            (v) => String(v.id) === String(item.variantId)
                        );
                        if (variant) {
                            resolved.push({ variantId: item.variantId, quantity: item.quantity, product, variant });
                            break;
                        }
                    }
                }
                setDisplayItems(resolved);
            } catch {
                setDisplayItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [cartItems]);

    const total = displayItems.reduce((sum, item) => {
        const price = item.variant.sale_price ?? item.variant.price;
        return sum + price * item.quantity;
    }, 0);

    const totalQty = displayItems.reduce((s, i) => s + i.quantity, 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (displayItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <ShoppingBagEmpty />
                <p className="text-gray-500 text-lg">Giỏ hàng của bạn đang trống.</p>
                <Link
                    href="/sanpham"
                    className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all"
                >
                    Tiếp tục mua sắm
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10 max-w-4xl">
            <h1 className="text-3xl font-bold text-pink-700 mb-8">Giỏ hàng</h1>

            <div className="flex flex-col gap-4">
                {displayItems.map((item) => {
                    const price = item.variant.sale_price ?? item.variant.price;
                    return (
                        <div
                            key={String(item.variantId)}
                            className="grid grid-cols-[80px_1fr] gap-4 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm"
                        >
                            {/* Image */}
                            <div className="h-20 w-20 rounded-xl overflow-hidden bg-pink-50 border border-pink-100 flex-shrink-0">
                                <img
                                    src={item.product.images[0]}
                                    alt={item.product.name}
                                    className="w-full h-full object-contain p-1"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex flex-col justify-between gap-2 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-800 truncate">{item.product.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {item.variant.name}
                                            {item.variant.shade ? ` — ${item.variant.shade}` : ''}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => dispatch(removeFromCart({ variantId: item.variantId }))}
                                        className="flex-shrink-0 text-gray-400 hover:text-red-500 transition text-2xl leading-none"
                                        title="Xóa khỏi giỏ"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                    {/* Price */}
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-pink-600 font-bold">
                                            {(price * item.quantity).toLocaleString('vi-VN')}₫
                                        </span>
                                        {item.variant.sale_price && (
                                            <span className="text-xs text-gray-400 line-through">
                                                {(item.variant.price * item.quantity).toLocaleString('vi-VN')}₫
                                            </span>
                                        )}
                                        <span className="text-xs text-gray-400">
                                            ({price.toLocaleString('vi-VN')}₫ / sp)
                                        </span>
                                    </div>

                                    {/* Quantity controls */}
                                    <div className="flex items-center rounded-full border border-pink-200 bg-pink-50 overflow-hidden">
                                        <button
                                            onClick={() => dispatch(decreaseQuantity({ variantId: item.variantId }))}
                                            className="px-3 py-1.5 text-pink-600 hover:bg-pink-100 transition font-bold text-lg leading-none"
                                        >
                                            −
                                        </button>
                                        <span className="w-8 text-center text-sm font-semibold text-gray-800">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => dispatch(increaseQuantity({ variantId: item.variantId }))}
                                            className="px-3 py-1.5 text-pink-600 hover:bg-pink-100 transition font-bold text-lg leading-none"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Order summary */}
            <div className="mt-8 rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-pink-800 mb-4">Tóm tắt đơn hàng</h2>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Số lượng sản phẩm</span>
                    <span>{totalQty}</span>
                </div>
                <div className="flex items-center justify-between font-bold text-gray-800 border-t border-pink-100 pt-3 mt-2">
                    <span>Tạm tính</span>
                    <span className="text-pink-700 text-lg">{total.toLocaleString('vi-VN')}₫</span>
                </div>
                <Link
                    href="/thanhtoan"
                    className="block mt-5 w-full py-3 text-center rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold text-sm hover:shadow-xl hover:scale-[1.01] transition-all"
                >
                    Tiến hành thanh toán
                </Link>
                <Link
                    href="/sanpham"
                    className="block text-center mt-3 text-sm text-pink-500 hover:text-pink-700 transition"
                >
                    ← Tiếp tục mua sắm
                </Link>
            </div>
        </div>
    );
}

function ShoppingBagEmpty() {
    return (
        <svg className="w-20 h-20 text-pink-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
    );
}
