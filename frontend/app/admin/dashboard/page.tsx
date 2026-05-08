export default function Dashboard() {

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bảng điều khiển</h1>
            <p className="text-gray-500 mb-8">Chào mừng trở lại, Admin. Sử dụng thanh bên để quản lý sản phẩm, danh mục và người dùng.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Sản phẩm</p>
                    <p className="text-sm text-gray-600">Quản lý danh sách sản phẩm, thêm mới hoặc chỉnh sửa thông tin.</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Danh mục</p>
                    <p className="text-sm text-gray-600">Phân loại sản phẩm theo danh mục để khách hàng dễ tìm kiếm.</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Người dùng</p>
                    <p className="text-sm text-gray-600">Xem danh sách tài khoản và điều chỉnh phân quyền quản trị.</p>
                </div>
            </div>
        </div>
    );
}