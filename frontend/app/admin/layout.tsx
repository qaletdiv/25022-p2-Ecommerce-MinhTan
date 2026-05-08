import Link from "next/link";
import AdminNav from "./components/AdminNav";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                {/* Sidebar */}
                <aside className="fixed inset-y-0 left-0 w-64 border-r border-gray-200 bg-white shadow-sm z-10">
                    <div className="flex h-full flex-col">
                        {/* Logo */}
                        <div className="flex h-16 items-center gap-3 border-b border-gray-100 px-6">
                            <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">B</span>
                            </div>
                            <h2 className="text-base font-bold text-gray-900">Admin Panel</h2>
                        </div>

                        <AdminNav />

                        {/* Back to storefront */}
                        <div className="border-t border-gray-100 p-4">
                            <Link
                                href="/"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Về trang chủ
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 pl-64 min-h-screen">
                    {/* Top bar */}
                    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
                        <div className="flex h-16 items-center justify-between px-8">
                            <div />
                            <div className="flex items-center gap-3">
                                <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </button>
                                <div className="w-9 h-9 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-sm">
                                    A
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}