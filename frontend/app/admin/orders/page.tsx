'use client';
import { Order } from '../../types/order';
import { useState, useEffect } from 'react';

function getToken() {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith('access_token='))
        ?.split('=')[1] ?? '';
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
    pending: { label: 'Chờ xác nhận', className: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200' },
    processing: { label: 'Đang xử lý', className: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' },
    shipped: { label: 'Đang giao', className: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200' },
    delivered: { label: 'Đã giao', className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
    cancelled: { label: 'Đã huỷ', className: 'bg-red-50 text-red-500 ring-1 ring-red-200' },
};

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3000/api/orders', {
            headers: { Authorization: `Bearer ${getToken()}` }
        })
            .then(r => r.json())
            .then(data => { setOrders(data); setLoading(false); });
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
                <span className="text-sm text-gray-500">{orders.length} đơn hàng</span>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mã đơn</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Khách hàng</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Thanh toán</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-900">{order.shippingInfo.name}</td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(order.date).toLocaleDateString()}</td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-900">{order.total.toLocaleString()}₫</td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-900">{order.paymentMethod}</td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm">
                                    <span className={`inline-flex rounded-full px-2 py-1 ${STATUS_CONFIG[order.status]?.className || 'bg-gray-50 text-gray-500 ring-1 ring-gray-200'}`}>
                                        {STATUS_CONFIG[order.status]?.label || order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
