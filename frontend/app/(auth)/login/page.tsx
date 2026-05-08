'use client';
import React, { Suspense } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get('from') || '/';
    const [serverError, setServerError] = React.useState('');

    // 2. Khởi tạo Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setServerError('');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (res.ok) {
                localStorage.setItem('user', JSON.stringify(result.user));
                document.cookie = `access_token=${result.token}; path=/`;

                if (result.user?.role === 'admin') {
                    router.push('/admin/dashboard');
                } else {
                    router.push(from);
                }
            } else {
                setServerError(result.message || 'Đăng nhập thất bại');
            }
        } catch (err) {
            setServerError('Đã xảy ra lỗi kết nối. Vui lòng thử lại.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 to-pink-200">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-pink-700">Đăng nhập</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-pink-600">Email</label>
                        <input
                            {...register("email")}
                            type="email"
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 ${errors.email ? 'border-red-500' : 'border-pink-300'
                                }`}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-pink-600">Mật khẩu</label>
                        <input
                            {...register("password")}
                            type="password"
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 ${errors.password ? 'border-red-500' : 'border-pink-300'
                                }`}
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                    </div>

                    {/* Hiển thị lỗi từ server (nếu có) */}
                    {serverError && (
                        <div className="p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                            {serverError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2 px-4 bg-pink-600 text-white font-semibold rounded-md hover:bg-pink-700 transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <LoadingSpinner size="sm" /> : 'Đăng nhập'}
                    </button>
                </form>

                <p className="mt-4 text-sm text-pink-600">
                    Chưa có tài khoản? <a href="/register" className="text-pink-500 hover:text-pink-700 font-medium">Đăng ký</a>
                </p>
            </div>
        </div>
    );
}

export default function Login() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}