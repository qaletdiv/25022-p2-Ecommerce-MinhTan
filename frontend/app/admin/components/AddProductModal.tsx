'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Category } from '../../types/category';

interface AddProductModalProps {
    categories: Category[];
}

function getToken() {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith('access_token='))
        ?.split('=')[1];
}

const initialForm = {
    category_id: '',
    name: '',
    slug: '',
    brand: '',
    description: '',
    images: '',
    tags: '',
    base_price: '',
    is_featured: false,
};

export default function AddProductModal({ categories }: AddProductModalProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState(initialForm);

    const handleClose = () => {
        setOpen(false);
        setError('');
        setForm(initialForm);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    category_id: form.category_id,
                    name: form.name,
                    slug: form.slug || undefined,
                    brand: form.brand || undefined,
                    description: form.description || undefined,
                    images: form.images
                        ? form.images.split('\n').map(s => s.trim()).filter(Boolean)
                        : [],
                    tags: form.tags
                        ? form.tags.split(',').map(s => s.trim()).filter(Boolean)
                        : [],
                    base_price: Number(form.base_price),
                    is_featured: form.is_featured,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.message || 'Có lỗi xảy ra');
                return;
            }

            handleClose();
            router.refresh();
        } catch {
            setError('Không thể kết nối đến server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white text-sm font-medium rounded-lg hover:bg-pink-600 transition-colors"
            >
                <span className="text-lg leading-none">+</span> Thêm sản phẩm
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-semibold text-gray-900">Thêm sản phẩm mới</h2>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                                aria-label="Đóng"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Danh mục */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Danh mục <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    value={form.category_id}
                                    onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                                >
                                    <option value="">-- Chọn danh mục --</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Tên sản phẩm */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên sản phẩm <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Anessa Perfect UV Sunscreen Skincare Milk"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                <input
                                    type="text"
                                    value={form.slug}
                                    onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                                    placeholder="anessa-perfect-uv-sunscreen (tự tạo nếu để trống)"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                                />
                            </div>

                            {/* Thương hiệu */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
                                <input
                                    type="text"
                                    value={form.brand}
                                    onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                                    placeholder="Anessa"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                                />
                            </div>

                            {/* Mô tả */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                <textarea
                                    rows={3}
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    placeholder="Kem chống nắng SPF50+ PA++++ chống nước hiệu quả."
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
                                />
                            </div>

                            {/* Ảnh */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ảnh <span className="text-gray-400 font-normal">(mỗi URL một dòng)</span>
                                </label>
                                <textarea
                                    rows={2}
                                    value={form.images}
                                    onChange={e => setForm(f => ({ ...f, images: e.target.value }))}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
                                />
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tags <span className="text-gray-400 font-normal">(phân cách bằng dấu phẩy)</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.tags}
                                    onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                                    placeholder="sunscreen, spf50, uv-protection"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                                />
                            </div>

                            {/* Giá gốc */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Giá gốc (VNĐ) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    type="number"
                                    min={0}
                                    value={form.base_price}
                                    onChange={e => setForm(f => ({ ...f, base_price: e.target.value }))}
                                    placeholder="690000"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                                />
                            </div>

                            {/* Nổi bật */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_featured"
                                    checked={form.is_featured}
                                    onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
                                    className="w-4 h-4 accent-pink-500 border-gray-300 rounded"
                                />
                                <label htmlFor="is_featured" className="text-sm text-gray-700">
                                    Sản phẩm nổi bật
                                </label>
                            </div>

                            {error && (
                                <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 text-sm bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-60"
                                >
                                    {loading ? 'Đang lưu...' : 'Thêm sản phẩm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
