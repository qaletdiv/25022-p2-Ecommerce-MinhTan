'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../redux/hooks';
import { addToCart } from '../redux/slices/cart.slice';

export default function AddToCartButton({ variantId }: { variantId: string }) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [added, setAdded] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        if (!user) {
            router.push(`/login?from=${encodeURIComponent(window.location.pathname)}`);
            return;
        }
        dispatch(addToCart({ variantId, quantity: 1 }));
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    return (
        <button
            onClick={handleClick}
            className={`w-full mt-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                added
                    ? 'bg-emerald-500 text-white'
                    : 'bg-pink-500 hover:bg-pink-600 text-white'
            }`}
        >
            {added ? '✓ Đã thêm' : 'Thêm vào giỏ hàng'}
        </button>
    );
}
