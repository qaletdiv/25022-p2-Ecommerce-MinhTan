import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import OrderCard from './OrderCard';

export default async function Profile() {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
        redirect('/login?from=/profile');
    }

    const res = await fetch('http://localhost:3000/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
    });

    if (!res.ok) {
        redirect('/login?from=/profile');
    }

    const user = await res.json();

    const ordersRes = await fetch('http://localhost:3000/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
    });

    if (!ordersRes.ok) {
        redirect('/login?from=/profile');
    }

    const orders = await ordersRes.json();

    return (
        <div className="container mx-auto px-4 py-10 max-w-3xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Tài khoản của tôi</h1>

            {/* User info card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
                <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                        {user.username?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div>
                        <p className="text-lg font-bold text-gray-800">{user.username}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <span className={`ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-pink-50 text-pink-700'
                        }`}>
                        {user.role === 'admin' ? 'Admin' : 'Khách hàng'}
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 border-t border-gray-100 pt-4">
                    <div>
                        <p className="text-xs text-gray-400 mb-0.5">Họ và tên</p>
                        <p className="font-medium text-gray-800">{user.username}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 mb-0.5">Email</p>
                        <p className="font-medium text-gray-800">{user.email}</p>
                    </div>
                </div>
                <div className="flex gap-3 mt-5">
                    <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                        Chỉnh sửa thông tin
                    </button>
                    <button className="px-4 py-2 rounded-lg border border-red-200 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                        Đổi mật khẩu
                    </button>
                </div>
            </div>
            {/* Lịch sử đặt hàng: Hiển thị danh sách tất cả các đơn hàng mà người dùng đã đặt trước đó. Mỗi đơn hàng hiển thị các thông tin cơ bản như Mã đơn hàng, Ngày đặt, Tổng tiền, Trạng thái. */}
            <div className="min-h-screen bg-gray-50 px-4 py-10">
                <div className="mx-auto max-w-5xl">
                    <h1 className="mb-8 text-3xl font-bold text-gray-800">
                        Lịch sử đặt hàng
                    </h1>

                    <div className="space-y-6">
                        {orders.map((order: any) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}