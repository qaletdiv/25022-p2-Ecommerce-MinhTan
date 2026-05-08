'use client';
import React, { useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const registerSchema = z.object({
    username: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirm_password: z.string()
}).refine((data) => data.password === data.confirm_password, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirm_password"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setServerError(null);
        try {
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setServerError(
                    response.status === 409
                        ? 'Email này đã được sử dụng. Vui lòng chọn email khác.'
                        : result.message || 'Đăng ký thất bại, vui lòng thử lại.'
                );
            }
        } catch {
            setServerError("Không thể kết nối máy chủ, vui lòng thử lại.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 to-pink-200">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-pink-700">Đăng ký tài khoản</h2>

                {/* Success banner */}
                {success && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Đăng ký thành công! Đang chuyển đến trang đăng nhập…
                    </div>
                )}

                {/* Server error */}
                {serverError && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Họ và tên */}
                    <div>
                        <label className="block text-sm font-medium text-pink-600">Họ và tên</label>
                        <input
                            {...register("username")}
                            type="text"
                            placeholder="Nguyễn Văn A"
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 ${errors.username ? 'border-red-500' : 'border-pink-300'}`}
                        />
                        {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-pink-600">Email</label>
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="example@email.com"
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 ${errors.email ? 'border-red-500' : 'border-pink-300'}`}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-pink-600">Mật khẩu</label>
                        <input
                            {...register("password")}
                            type="password"
                            placeholder="Ít nhất 6 ký tự"
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 ${errors.password ? 'border-red-500' : 'border-pink-300'}`}
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-pink-600">Nhập lại mật khẩu</label>
                        <input
                            {...register("confirm_password")}
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 ${errors.confirm_password ? 'border-red-500' : 'border-pink-300'}`}
                        />
                        {errors.confirm_password && <p className="mt-1 text-xs text-red-500">{errors.confirm_password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || success}
                        className="w-full py-2 px-4 bg-pink-600 text-white font-semibold rounded-md hover:bg-pink-700 transition-colors disabled:bg-pink-300"
                    >
                        {isSubmitting ? <LoadingSpinner size="sm" /> : 'Đăng ký'}
                    </button>
                </form>

                <p className="mt-4 text-sm text-pink-600">
                    Đã có tài khoản? <a href="/login" className="text-pink-500 hover:text-pink-700 font-medium">Đăng nhập</a>
                </p>
            </div>
        </div>
    );
}