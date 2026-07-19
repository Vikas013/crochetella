import Image from "next/image";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56">
        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 100vw" />
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-rose-700">{product.category}</p>
            <h3 className="text-xl font-bold text-stone-900">{product.name}</h3>
          </div>
          <p className="rounded-full bg-amber-100 px-3 py-1 font-bold text-amber-900">${product.price}</p>
        </div>
        <p className="text-sm leading-6 text-stone-600">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-emerald-700">{product.stock} in stock</span>
          <button className="rounded-full bg-stone-900 px-4 py-2 text-sm font-bold text-white">Add to cart</button>
        </div>
      </div>
    </article>
  );
}
