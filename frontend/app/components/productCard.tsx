import Image from "next/image";
import { Product } from "../types/product";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product }: { product: Product }) {
    const defaultVariant = product.variants?.find(v => v.is_default) ?? product.variants?.[0];
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:shadow-pink-200/50 transition-all duration-300 border border-pink-100 flex flex-col">
            <div className="relative h-48 overflow-hidden bg-white flex-shrink-0">
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-contain p-2"
                />
            </div>
            <div className="p-4 flex flex-col flex-1">
                <Link href={`/sanpham/${product.slug}`} className="text-lg text-pink-800 font-semibold mb-2 hover:text-pink-600 transition-colors line-clamp-2 leading-snug">
                    {product.name}
                </Link>
                <p className="text-pink-600 text-sm mb-2 font-medium">{product.brand}</p>
                <p className="text-pink-700 text-xs mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-pink-600">{product.base_price.toLocaleString('vi-VN')} VND</span>
                    <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="text-sm text-pink-600">{product.rating} ({product.review_count})</span>
                    </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                    {product.tags.map((tag, index) => (
                        <span key={index} className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="mt-auto pt-3">
                    {defaultVariant && <AddToCartButton variantId={defaultVariant.id} />}
                </div>
            </div>
        </div>
    );
}