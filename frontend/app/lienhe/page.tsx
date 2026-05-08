'use client';

import { useState } from 'react';
import {
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    ClockIcon,
    PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate sending — replace with real API call if needed
        await new Promise(res => setTimeout(res, 800));
        setLoading(false);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-pink-50/40">
            {/* Hero */}
            <div className="bg-gradient-to-br from-pink-100 to-white border-b border-pink-100 py-14 text-center">
                <h1 className="text-4xl font-bold text-pink-800 mb-3">Liên hệ với chúng tôi</h1>
                <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
                    Chúng tôi luôn sẵn lòng lắng nghe bạn. Hãy gửi tin nhắn và đội ngũ của chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                </p>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông tin liên hệ</h2>
                        <div className="space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                                    <MapPinIcon className="w-5 h-5 text-pink-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Địa chỉ</p>
                                    <p className="text-sm text-gray-500 mt-0.5">Số 1 Đại Lộ Sắc Đẹp, TP. Hồ Chí Minh</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                                    <PhoneIcon className="w-5 h-5 text-pink-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Điện thoại</p>
                                    <a href="tel:0900000000" className="text-sm text-pink-600 hover:underline mt-0.5 block">0900 000 000</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                                    <EnvelopeIcon className="w-5 h-5 text-pink-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Email</p>
                                    <a href="mailto:hello@beautyglow.vn" className="text-sm text-pink-600 hover:underline mt-0.5 block">hello@beautyglow.vn</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                                    <ClockIcon className="w-5 h-5 text-pink-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Giờ làm việc</p>
                                    <p className="text-sm text-gray-500 mt-0.5">Thứ 2 – Thứ 7: 8:00 – 18:00</p>
                                    <p className="text-sm text-gray-500">Chủ nhật: 9:00 – 12:00</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map placeholder */}
                    <div className="rounded-2xl overflow-hidden border border-pink-100 shadow-sm h-56 bg-pink-100 flex items-center justify-center text-pink-400 text-sm">
                        <MapPinIcon className="w-6 h-6 mr-2" />
                        Bản đồ Google Maps
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Gửi tin nhắn</h2>

                    {submitted ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                <PaperAirplaneIcon className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Gửi thành công!</h3>
                            <p className="text-sm text-gray-500">Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 24 giờ.</p>
                            <button
                                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '' }); }}
                                className="mt-6 text-sm text-pink-600 hover:underline"
                            >
                                Gửi tin nhắn khác
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Họ và tên <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Nguyễn Văn A"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Email <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="example@email.com"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="0900 000 000"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Nội dung <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    placeholder="Nhập nội dung tin nhắn của bạn..."
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-70 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                            >
                                {loading ? (
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <PaperAirplaneIcon className="w-4 h-4" />
                                )}
                                {loading ? 'Đang gửi...' : 'Gửi tin nhắn'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
