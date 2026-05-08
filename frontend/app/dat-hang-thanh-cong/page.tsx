'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type OrderItem = {
    productName: string;
    variantName: string;
    shade: string | null;
    quantity: number;
    price: number;
    image?: string;
};

type Order = {
    id: string;
    date: string;
    items: OrderItem[];
    shippingInfo: { name: string; phone: string; address: string; note?: string };
    paymentMethod: string;
    subtotal: number;
    shipping: number;
    total: number;
    status: string;
};

const PAYMENT_LABELS: Record<string, string> = {
    cod: 'Thanh toán khi nhận hàng (COD)',
    momo: 'Ví MoMo',
    vnpay: 'VNPAY QR',
    bank: 'Thẻ ngân hàng / Visa / Mastercard',
};

function fmt(n: number) { return n.toLocaleString('vi-VN') + '₫'; }

function ConfirmationContent() {
    const params = useSearchParams();
    const orderId = params.get('orderId') ?? '';
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (!orderId) return;
        try {
            const stored = JSON.parse(localStorage.getItem('orders') ?? '[]') as Order[];
            setOrder(stored.find(o => o.id === orderId) ?? null);
        } catch {
            setOrder(null);
        }
    }, [orderId]);

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            {/* Success banner */}
            <div className="flex flex-col items-center text-center mb-10">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h1>
                <p className="text-gray-500 text-sm max-w-xs">
                    Cảm ơn bạn đã tin tưởng mua sắm. Đơn hàng đang được tiếp nhận và xử lý.
                </p>
                {orderId && (
                    <p className="mt-3 bg-pink-50 text-pink-700 font-mono text-sm px-4 py-1.5 rounded-full border border-pink-100">
                        Mã đơn hàng: <span className="font-bold">{orderId}</span>
                    </p>
                )}
            </div>

            {/* Order summary */}
            {order ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                    {/* Items */}
                    <div className="px-6 py-5 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Sản phẩm đã đặt</p>
                        <div className="space-y-3">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    {item.image ? (
                                        <img src={item.image} alt={item.productName}
                                            className="w-12 h-12 rounded-xl object-contain bg-pink-50 border border-pink-100 flex-shrink-0" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0 text-pink-500 font-bold">
                                            {item.productName[0]}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{item.productName}</p>
                                        <p className="text-xs text-gray-400">
                                            {item.variantName}{item.shade ? ` — ${item.shade}` : ''} × {item.quantity}
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-700 flex-shrink-0">
                                        {fmt(item.price * item.quantity)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping + Payment */}
                    <div className="px-6 py-4 border-b border-gray-100 grid sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Giao tới</p>
                            <p className="font-medium text-gray-800">{order.shippingInfo.name}</p>
                            <p className="text-gray-600">{order.shippingInfo.phone}</p>
                            <p className="text-gray-600 mt-0.5">{order.shippingInfo.address}</p>
                            {order.shippingInfo.note && (
                                <p className="text-xs text-gray-400 italic mt-1">"{order.shippingInfo.note}"</p>
                            )}
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Thanh toán</p>
                            <p className="text-gray-800">{PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}</p>
                            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200">
                                {order.status}
                            </div>
                        </div>
                    </div>

                    {/* Price breakdown */}
                    <div className="px-6 py-4 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-500">
                            <span>Tạm tính</span><span>{fmt(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Phí vận chuyển</span>
                            <span>{order.shipping === 0
                                ? <span className="text-emerald-600">Miễn phí</span>
                                : fmt(order.shipping)}
                            </span>
                        </div>
                        <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2">
                            <span>Tổng thanh toán</span>
                            <span className="text-pink-600 text-base">{fmt(order.total)}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-50 rounded-2xl border border-gray-200 px-6 py-8 mb-6 text-center space-y-2">
                    <p className="text-sm text-gray-500">Chi tiết đơn hàng sẽ hiển thị trong lịch sử đơn hàng.</p>
                </div>
            )}

            {/* Navigation buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Link
                    href="/sanpham"
                    className="flex-1 text-center px-6 py-3 rounded-xl border border-pink-300 text-pink-600 font-semibold text-sm hover:bg-pink-50 transition-colors"
                >
                    Tiếp tục mua sắm
                </Link>
                <Link
                    href="/profile"
                    className="flex-1 text-center px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-pink-200 transition-all"
                >
                    Xem lịch sử đơn hàng
                </Link>
            </div>
        </div>
    );
}

export default function DatHangThanhCong() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-pink-500 border-t-transparent" />
            </div>
        }>
            <ConfirmationContent />
        </Suspense>
    );
}
