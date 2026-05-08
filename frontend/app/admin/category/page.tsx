import { Eye } from 'lucide-react';
import type { Category } from '../../types/category';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export default async function Category() {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
    const categories: Category[] = await data.json();

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white text-sm font-medium rounded-lg hover:bg-pink-600 transition-colors">
                    <span className="text-lg leading-none">+</span> Thêm danh mục
                </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">STT</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên danh mục</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.map((cat, index) => (
                            <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-3.5 text-sm text-gray-500">{index + 1}</td>
                                <td className="px-5 py-3.5 text-xs font-mono text-gray-400">{cat.id}</td>
                                <td className="px-5 py-3.5 text-sm font-medium text-gray-800">{cat.name}</td>
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