import { Product } from "./types/product";
import ProductCard from "./components/productCard";
import Slideshow from "./components/slideShow";
import Link from "next/link";

export default async function Home() {
  const data = await fetch('http://localhost:3000/api/products');
  const products: Product[] = await data.json();

  const productByCategory1 = products.filter(p => p.category_id === 'cat-001' && p.is_featured);

  const productByCategory2 = products.filter(p => p.category_id === 'cat-002' && p.is_featured);

  return (
    <div>
      <Slideshow />
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-12 text-pink-600">BeautyGlow</h1>
          <h4 className="text-3xl font-bold mb-8 text-pink-700">Mỹ phẩm chăm sóc da</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl px-4 mb-16">
            {productByCategory1.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <h4 className="text-3xl font-bold mb-8 text-pink-700">Mỹ phẩm trang điểm</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl px-4">
            {productByCategory2.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}