'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Product } from "../../types/product";
import LoadingSpinner from "../../components/LoadingSpinner";
import ProductImageCarousel from "../../components/productImageCarousel";
import ProductInfoSection from "../../components/productInfoSection";

export default function ProductDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        setNotFound(false);

        const fetchData = async () => {
            try {
                const productData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`);
                const productJson: Product = await productData.json();

                if (!productJson?.id) {
                    setNotFound(true);
                    setLoading(false);
                    return;
                }

                setProduct(productJson);

                try {
                    const relatedData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/productsrelated/${slug}`);
                    const relatedJson: Product[] = await relatedData.json();
                    setRelatedProducts(relatedJson);
                } catch {
                    setRelatedProducts([]);
                }
            } catch {
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (notFound || !product) {
        return (
            <div className="container mx-auto py-16 px-4 text-center">
                <h4 className="text-3xl font-bold mb-4 text-pink-700">Sản phẩm không tìm thấy</h4>
                <p className="text-gray-600">Xin lỗi, không tìm thấy sản phẩm với mã {slug}.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
                <div className="space-y-6">
                    <ProductImageCarousel images={product.images ?? []} />
                </div>
                <ProductInfoSection product={product} />
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-xl border border-pink-100 mt-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-pink-800">Sản phẩm liên quan</h2>
                </div>
                {/* Container trượt ngang */}
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                    {relatedProducts?.map((relatedProduct) => (
                        <Link
                            key={relatedProduct.id}
                            href={`/sanpham/${relatedProduct.slug}`}
                            className="flex-none w-[280px] snap-start grid grid-cols-[90px_1fr] gap-4 rounded-3xl border border-pink-100 bg-pink-50 p-4 hover:shadow-md hover:border-pink-300 transition-all duration-200"
                        >
                            {/* Hình ảnh */}
                            <div className="h-[90px] w-[90px] overflow-hidden rounded-2xl bg-white border border-pink-100">
                                <img
                                    src={relatedProduct.images[0]}
                                    alt={relatedProduct.name}
                                    className="w-full h-full object-contain p-1"
                                />
                            </div>
                            {/* Thông tin sản phẩm */}
                            <div className="flex flex-col justify-between gap-2 overflow-hidden">
                                <div>
                                    <p className="text-sm font-medium text-pink-700 truncate">{relatedProduct.name}</p>
                                    <p className="text-xs text-gray-600">Kho: {relatedProduct.variants[0]?.stock}</p>
                                </div>

                                <div className="flex items-center justify-between gap-1">
                                    <div>
                                        {relatedProduct.variants[0]?.sale_price ? (
                                            <div>
                                                <p className="text-md font-semibold text-pink-700">
                                                    {relatedProduct.variants[0]?.sale_price.toLocaleString('vi-VN')}₫
                                                </p>
                                                <p className="text-xs text-gray-500 line-through">
                                                    {relatedProduct.variants[0]?.price.toLocaleString('vi-VN')}₫
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-md font-semibold text-pink-700">
                                                {relatedProduct.variants[0]?.price.toLocaleString('vi-VN')}₫
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}