'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { clearCart } from '../redux/slices/cart.slice';
import { CartItem } from '../types/cart';
import { Product, ProductVariant } from '../types/product';
import LoadingSpinner from '../components/LoadingSpinner';

const PAYMENT_METHODS = [
    { id: 'cod', label: 'Thanh toán khi nhận hàng (COD)', icon: '💵' },
    { id: 'momo', label: 'Ví MoMo', icon: '💜' },
    { id: 'vnpay', label: 'VNPAY QR', icon: '🏦' },
    { id: 'bank', label: 'Thẻ ngân hàng / Visa / Mastercard', icon: '💳' },
];

type DisplayItem = { variantId: CartItem['variantId']; quantity: number; product: Product; variant: ProductVariant };

function getToken() {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith('access_token='))
        ?.split('=')[1] ?? '';
}

export default function ThanhToan() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state: any) => state.cart.items as CartItem[]);

    const [displayItems, setDisplayItems] = useState<DisplayItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [placing, setPlacing] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Login guard
    useEffect(() => {
        if (!localStorage.getItem('user')) {
            router.replace('/login?from=/thanhtoan');
        }
    }, [router]);

    useEffect(() => {
        if (cartItems.length === 0) { setLoading(false); return; }
        const load = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
                const products: Product[] = await res.json();
                const resolved: DisplayItem[] = [];
                for (const item of cartItems) {
                    for (const product of products) {
                        const variant = product.variants.find(v => String(v.id) === String(item.variantId));
                        if (variant) { resolved.push({ variantId: item.variantId, quantity: item.quantity, product, variant }); break; }
                    }
                }
                setDisplayItems(resolved);
            } finally { setLoading(false); }
        };
        load();
    }, [cartItems]);

    const subtotal = displayItems.reduce((s, i) => s + (i.variant.sale_price ?? i.variant.price) * i.quantity, 0);
    const shipping = subtotal >= 500000 ? 0 : 30000;
    const total = subtotal + shipping;

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = 'Vui lòng nhập họ tên';
        if (!/^0\d{9}$/.test(form.phone)) e.phone = 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)';
        if (!form.address.trim()) e.address = 'Vui lòng nhập địa chỉ';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handlePlaceOrder = async () => {
        if (!validate()) return;
        setPlacing(true);
        await new Promise(r => setTimeout(r, 1200));
        const orderId = 'ORD-' + Date.now().toString(36).toUpperCase();

        // Save order to localStorage so profile page can show it
        const order = {
            date: new Date().toISOString(),
            items: displayItems.map(i => ({
                productName: i.product.name,
                variantName: i.variant.name,
                shade: i.variant.shade ?? null,
                quantity: i.quantity,
                price: i.variant.sale_price ?? i.variant.price,
                image: i.product.images[0],
            })),
            shippingInfo: { name: form.name, phone: form.phone, address: form.address, note: form.note },
            paymentMethod,
            subtotal,
            shipping,
            total,
            status: 'Chờ xác nhận',
        };
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(order),
        });

        dispatch(clearCart());
        router.push(`/dat-hang-thanh-cong?orderId=${orderId}&total=${total}`);
    };

    if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>;

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-gray-500">Giỏ hàng trống. Không thể thanh toán.</p>
                <a href="/sanpham" className="px-6 py-2.5 bg-pink-500 text-white rounded-full text-sm font-semibold">Mua sắm ngay</a>
            </div>
        );
    }

    const inputCls = (field: string) =>
        `w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition ${errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200'}`;

    return (
        <div className="container mx-auto px-4 py-10 max-w-5xl">
            <h1 className="text-3xl font-bold text-pink-700 mb-8">Thanh toán</h1>

            <div className="grid gap-8 lg:grid-cols-[1fr_380px] items-start">
                {/* Left: form */}
                <div className="space-y-6">
                    {/* Shipping info */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-base font-bold text-gray-800 mb-4">Thông tin giao hàng</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Họ và tên *</label>
                                <input className={inputCls('name')} placeholder="Nguyễn Văn A"
                                    value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Số điện thoại *</label>
                                <input className={inputCls('phone')} placeholder="0901234567" type="tel"
                                    value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Địa chỉ giao hàng *</label>
                                <input className={inputCls('address')} placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành"
                                    value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Ghi chú</label>
                                <textarea className={inputCls('note') + ' resize-none'} rows={2} placeholder="Ghi chú cho người giao hàng (không bắt buộc)"
                                    value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
                            </div>
                        </div>
                    </div>

                    {/* Payment methods */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-base font-bold text-gray-800 mb-4">Phương thức thanh toán</h2>
                        <div className="space-y-3">
                            {PAYMENT_METHODS.map(pm => (
                                <label key={pm.id}
                                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${paymentMethod === pm.id
                                        ? 'border-pink-400 bg-pink-50 ring-1 ring-pink-300'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <input type="radio" name="payment" value={pm.id} checked={paymentMethod === pm.id}
                                        onChange={() => setPaymentMethod(pm.id)} className="accent-pink-500" />
                                    <span className="text-xl">{pm.icon}</span>
                                    <span className="text-sm font-medium text-gray-700">{pm.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: order summary */}
                <div className="sticky top-24">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-base font-bold text-gray-800 mb-4">Đơn hàng ({displayItems.length} sản phẩm)</h2>

                        <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
                            {displayItems.map(item => {
                                const price = item.variant.sale_price ?? item.variant.price;
                                return (
                                    <div key={String(item.variantId)} className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-pink-50 flex-shrink-0 border border-pink-100">
                                            <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-contain p-1" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-gray-700 truncate">{item.product.name}</p>
                                            <p className="text-xs text-gray-400">{item.variant.name} × {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-800 flex-shrink-0">
                                            {(price * item.quantity).toLocaleString('vi-VN')}₫
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="border-t border-gray-100 pt-4 space-y-2">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Tạm tính</span>
                                <span>{subtotal.toLocaleString('vi-VN')}₫</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Phí vận chuyển</span>
                                <span>{shipping === 0 ? <span className="text-emerald-600">Miễn phí</span> : `${shipping.toLocaleString('vi-VN')}₫`}</span>
                            </div>
                            {shipping > 0 && (
                                <p className="text-xs text-gray-400">Miễn phí vận chuyển cho đơn từ 500.000₫</p>
                            )}
                            <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2 mt-2">
                                <span>Tổng cộng</span>
                                <span className="text-pink-600">{total.toLocaleString('vi-VN')}₫</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={placing}
                            className="mt-5 w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold text-sm hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {placing ? <><LoadingSpinner size="sm" /> Đang đặt hàng...</> : 'Đặt hàng'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
