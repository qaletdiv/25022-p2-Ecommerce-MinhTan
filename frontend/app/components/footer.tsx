import React from 'react';
import {
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    HeartIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
    return (
        <footer className="bg-pink-50 border-t border-pink-200 pt-20 pb-10">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Cột 1: About */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-pink-800">Về BeautyGlow</h3>
                        <p className="text-pink-700 text-sm leading-relaxed">
                            Chúng tôi cung cấp các giải pháp chăm sóc da toàn diện từ thiên nhiên.
                            Mỗi sản phẩm đều trải qua quy trình kiểm duyệt nghiêm ngặt để mang lại hiệu quả tốt nhất cho khách hàng.
                        </p>
                    </div>

                    {/* Cột 2: Quick Links */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600 mb-6">Sản phẩm</h4>
                        <ul className="space-y-4 text-sm font-medium text-gray-600">
                            {['Serum trị mụn', 'Kem chống nắng', 'Sữa rửa mặt', 'Mặt nạ ngủ'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="flex items-center group hover:text-pink-500 transition-colors">
                                        <ArrowRightIcon className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-all -ml-5 group-hover:ml-0" />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Cột 3: Support */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600 mb-6">Hỗ trợ khách hàng</h4>
                        <ul className="space-y-4 text-sm font-medium text-gray-600">
                            <li><a href="#" className="hover:text-pink-500 transition-colors">Chính sách vận chuyển</a></li>
                            <li><a href="#" className="hover:text-pink-500 transition-colors">Đổi trả & Hoàn tiền</a></li>
                            <li><a href="#" className="hover:text-pink-500 transition-colors">Câu hỏi thường gặp</a></li>
                            <li><a href="#" className="hover:text-pink-500 transition-colors">Liên hệ hợp tác</a></li>
                        </ul>
                    </div>

                    {/* Cột 4: Contact */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600 mb-6">Thông tin liên hệ</h4>
                        <ul className="space-y-4 text-sm text-gray-600">
                            <li className="flex items-start gap-3">
                                <MapPinIcon className="w-5 h-5 text-pink-500 shrink-0" />
                                <span>Số 1 Đại Lộ Sắc Đẹp, TP. Hà Nội</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <PhoneIcon className="w-5 h-5 text-pink-500 shrink-0" />
                                <span>1900 1234 (8:00 - 21:00)</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <EnvelopeIcon className="w-5 h-5 text-pink-500 shrink-0" />
                                <span>support@beautyglow.vn</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-20 pt-8 border-t border-pink-200 flex flex-col md:flex-row justify-between items-center text-sm text-pink-600">
                    <p>© {new Date().getFullYear()} BeautyGlow Cosmetics. Thiết kế bởi Gemini.</p>
                    <div className="flex items-center gap-1 mt-4 md:mt-0">
                        <span>Đam mê với</span>
                        <HeartIcon className="w-5 h-5 text-pink-500 fill-pink-500 mx-0.5" />
                        <span>vẻ đẹp Việt</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;