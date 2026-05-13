import { Eye } from 'lucide-react';
import { Product } from '../../types/product';
import type { Category } from '../../types/category';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import AddProductModal from '../components/AddProductModal';

export default async function Products() {
    const [productRes, categoryRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, { cache: 'no-store' }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, { cache: 'no-store' }),
    ]);
    const products: Product[] = await productRes.json();
    const categories: Category[] = await categoryRes.json();

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
                <AddProductModal categories={categories} />
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">STT</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Giá gốc</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Danh mục</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product, index) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-3.5 text-sm text-gray-500">{index + 1}</td>
                                <td className="px-5 py-3.5 text-xs font-mono text-gray-400">{product.id}</td>
                                <td className="px-5 py-3.5">
                                    <span className="text-sm font-medium text-gray-800">{product.name}</span>
                                </td>
                                <td className="px-5 py-3.5 text-sm text-gray-700">{product.base_price.toLocaleString('vi-VN')}₫</td>
                                <td className="px-5 py-3.5">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-pink-700">
                                        {product.category_name}
                                    </span>
                                </td>
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-1">
                                        <button className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors" title="Xem">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" title="Sửa">
                                            <PencilSquareIcon className="w-4 h-4" />
                                        </button>
                                        <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}