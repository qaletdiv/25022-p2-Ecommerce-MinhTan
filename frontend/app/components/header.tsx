'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
    MagnifyingGlassIcon,
    ShoppingBagIcon,
    UserIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const accountDropdownRef = useRef<HTMLDivElement | null>(null);
    const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cart = useSelector((state: any) => state.cart);

    // Parse once to avoid multiple JSON.parse calls in JSX
    const parsedUser = user ? (() => { try { return JSON.parse(user); } catch { return null; } })() : null;

    const cartItemCount = cart.items.reduce((total: number, item: any) => total + item.quantity, 0);

    const handleLogout = () => {
        localStorage.removeItem('user');
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        setUser(null);
        setIsAccountOpen(false);
        router.push('/login');
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchQuery(val);
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = setTimeout(() => {
            router.push(val.trim() ? `/sanpham?q=${encodeURIComponent(val.trim())}` : '/sanpham');
        }, 400);
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
            router.push(searchQuery.trim() ? `/sanpham?q=${encodeURIComponent(searchQuery.trim())}` : '/sanpham');
        }
    };

    useEffect(() => {
        setUser(localStorage.getItem('user'));
    }, [pathname]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                accountDropdownRef.current &&
                !accountDropdownRef.current.contains(event.target as Node)
            ) {
                setIsAccountOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full bg-pink-50 border-b border-pink-100 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between gap-4">

                {/* Logo */}
                <div className="flex-shrink-0 flex items-center cursor-pointer">
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center mr-2 shadow-sm">
                        <span className="text-white font-bold text-xl italic">B</span>
                    </div>
                    <span className="text-2xl font-bold tracking-tighter text-pink-800 hidden sm:block">
                        <Link href="/">
                            BEAUTY<span className="text-pink-500">GLOW</span>
                        </Link>
                    </span>
                </div>

                {/* Desktop Nav Links */}
                <nav className="hidden lg:flex items-center gap-6 flex-shrink-0">
                    <Link href="/" className="text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors">Trang chủ</Link>
                    <Link href="/sanpham" className="text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors">Sản phẩm</Link>
                    <Link href="/lienhe" className="text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors">Liên hệ</Link>
                </nav>

                {/* Search Bar - Desktop */}
                <div className="hidden md:flex flex-1 max-w-md relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchKeyDown}
                        placeholder="Tìm kiếm mỹ phẩm..."
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all outline-none text-sm"
                    />
                    <MagnifyingGlassIcon className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 sm:gap-2">
                    <button
                        onClick={() => { setIsSearchOpen(v => !v); setIsMenuOpen(false); }}
                        className="p-2.5 text-pink-600 hover:bg-pink-50 rounded-full transition-colors md:hidden"
                    >
                        <MagnifyingGlassIcon className="w-6 h-6" />
                    </button>

                    <Link href="/giohang" className="relative p-2.5 text-pink-600 hover:bg-pink-50 rounded-full cursor-pointer transition-colors">
                        <ShoppingBagIcon className="w-6 h-6" />
                        {cartItemCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 bg-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                                {cartItemCount}
                            </span>
                        )}
                    </Link>

                    {/* Auth: direct links when logged out, dropdown when logged in */}
                    {!parsedUser ? (
                        <div className="hidden md:flex items-center gap-2">
                            <Link href="/login" className="px-3.5 py-1.5 text-sm font-semibold text-pink-600 border border-pink-200 rounded-lg hover:bg-pink-50 transition-colors">
                                Đăng nhập
                            </Link>
                            <Link href="/register" className="px-3.5 py-1.5 text-sm font-semibold text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors">
                                Đăng ký
                            </Link>
                        </div>
                    ) : null}

                    <div className="relative" ref={accountDropdownRef}>
                        {parsedUser ? (
                            <>
                                <button
                                    className="p-2.5 text-pink-600 hover:bg-pink-50 rounded-full transition-colors"
                                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                                >
                                    <UserIcon className="w-6 h-6" />
                                </button>
                                {isAccountOpen && (
                                    <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                                        <div className="px-4 pt-3 pb-2.5 border-b border-gray-100">
                                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Tài khoản</p>
                                            <p className="text-sm font-semibold text-gray-800">{parsedUser.username}</p>
                                        </div>
                                        <div className="py-1.5">
                                            {parsedUser.role === 'admin' && (
                                                <Link href="/admin/dashboard" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-purple-700 font-medium hover:bg-purple-50 transition-colors">
                                                    ⚙️ Admin Panel
                                                </Link>
                                            )}
                                            <Link href="/profile" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                                                Tài khoản của tôi
                                            </Link>
                                            <div className="mx-3 my-1 border-t border-gray-100" />
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-500 font-medium hover:bg-red-50 transition-colors"
                                            >
                                                Đăng xuất
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Mobile-only: user icon opens dropdown for login/register */
                            <button
                                className="md:hidden p-2.5 text-pink-600 hover:bg-pink-50 rounded-full transition-colors"
                                onClick={() => setIsAccountOpen(!isAccountOpen)}
                            >
                                <UserIcon className="w-6 h-6" />
                            </button>
                        )}
                        {!parsedUser && isAccountOpen && (
                            <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-3 z-50">
                                <p className="px-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tài khoản</p>
                                <Link
                                    href="/login"
                                    onClick={() => setIsAccountOpen(false)}
                                    className="flex items-center mx-3 px-3 py-2.5 rounded-lg bg-pink-500 text-white font-semibold text-sm hover:bg-pink-600 transition-colors"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setIsAccountOpen(false)}
                                    className="flex items-center mx-3 mt-2 px-3 py-2.5 rounded-lg border border-pink-200 text-pink-600 font-semibold text-sm hover:bg-pink-50 transition-colors"
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        )}
                    </div>

                    <button
                        className="md:hidden p-2.5 text-pink-600 hover:bg-pink-50 rounded-xl transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
                    </button>
                </div>
            </div>

            {/* Mobile Search Bar */}
            {isSearchOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3">
                    <div className="relative">
                        <input
                            type="text"
                            autoFocus
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onKeyDown={handleSearchKeyDown}
                            placeholder="Tìm kiếm mỹ phẩm..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all outline-none text-sm"
                        />
                        <MagnifyingGlassIcon className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    </div>
                </div>
            )}

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-3 shadow-xl">
                    {/* Nav links */}
                    <div className="flex gap-4 pb-3 border-b border-gray-100">
                        <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">Trang chủ</Link>
                        <Link href="/sanpham" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">Sản phẩm</Link>
                        <Link href="/lienhe" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">Liên hệ</Link>
                    </div>
                    {user ? (
                        <>
                            <p className="text-gray-700 font-medium px-1">{JSON.parse(user).username}</p>
                            {JSON.parse(user).role === 'admin' && (
                                <Link href="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="block py-2.5 text-center border border-purple-200 text-purple-700 rounded-xl font-medium">
                                    Admin Panel
                                </Link>
                            )}
                            <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="block py-2.5 text-center border border-pink-200 text-pink-600 rounded-xl font-medium">
                                Tài khoản của tôi
                            </Link>
                            <button
                                onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                                className="w-full py-2.5 text-center bg-red-50 text-red-500 rounded-xl font-medium"
                            >
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2 py-3.5 bg-pink-500 text-white rounded-xl font-semibold">
                                <UserIcon className="w-5 h-5" />
                                Đăng nhập
                            </Link>
                            <Link href="/register" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2 py-3.5 border border-pink-300 text-pink-600 rounded-xl font-semibold">
                                Đăng ký
                            </Link>
                        </>
                    )}
                </div>
            )}
        </header>
    );
};