'use client';

import { useState } from 'react';

interface OrderItem {
    productName: string;
    variantName?: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    date: string;
    total: number;
    status: string;
    items: OrderItem[];
}

const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('vi-VN');

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Chờ xác nhận': return 'bg-yellow-100 text-yellow-700';
        case 'Đang giao':    return 'bg-blue-100 text-blue-700';
        case 'Hoàn thành':  return 'bg-green-100 text-green-700';
        case 'Đã hủy':      return 'bg-red-100 text-red-700';
        default:             return 'bg-gray-100 text-gray-700';
    }
};

export default function OrderCard({ order }: { order: Order }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            {/* Header */}
            <div className="flex flex-col gap-4 border-b pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm text-gray-500">Mã đơn hàng</p>
                    <h2 className="text-lg font-semibold text-gray-800">{order.id}</h2>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Ngày đặt</p>
                    <p className="font-medium text-gray-700">{formatDate(order.date)}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Tổng tiền</p>
                    <p className="font-semibold text-pink-600">{formatPrice(order.total)}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                </div>
            </div>

            {/* Items */}
            {expanded && (
                <div className="mt-4 space-y-3">
                    {order.items.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
                        >
                            <div>
                                <h3 className="font-medium text-gray-800">{item.productName}</h3>
                                {item.variantName && (
                                    <p className="text-sm text-gray-500">Phân loại: {item.variantName}</p>
                                )}
                            </div>

                            <div className="text-right">
                                <p className="text-sm text-gray-500">SL: {item.quantity}</p>
                                <p className="font-medium text-gray-700">{formatPrice(item.price)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="mt-5 flex justify-end gap-3">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                    {expanded ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                </button>

                <button className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-700">
                    Mua lại
                </button>
            </div>
        </div>
    );
}
