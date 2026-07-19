import { AdminDashboard } from "@/components/AdminDashboard";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/lib/data";

export default function Home() {
  const featured = products.filter((product) => product.featured);

  return (
    <main>
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <a className="text-2xl font-black tracking-tight text-stone-950" href="#top">Crochetella</a>
        <nav className="hidden items-center gap-6 text-sm font-bold text-stone-700 md:flex">
          <a href="#shop">Shop</a>
          <a href="#admin">Admin</a>
          <a href="#checkout">Checkout</a>
          <a href="/auth/sign-in">Sign in</a>
        </nav>
        <button className="rounded-full bg-rose-700 px-5 py-3 text-sm font-bold text-white">Cart · 0</button>
      </header>

      <section id="top" className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div className="space-y-8">
          <p className="inline-flex rounded-full bg-rose-100 px-4 py-2 text-sm font-bold text-rose-800">Handmade crochet commerce</p>
          <div className="space-y-5">
            <h1 className="text-5xl font-black tracking-tight text-stone-950 md:text-7xl">A cozy storefront built for one creative business.</h1>
            <p className="max-w-2xl text-lg leading-8 text-stone-700">Crochetella combines an SEO-friendly product catalog, realtime inventory planning, cart, checkout, orders, and an admin dashboard into one responsive Next.js experience.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a className="rounded-full bg-stone-950 px-6 py-4 text-center font-bold text-white" href="#shop">Browse products</a>
            <a className="rounded-full border border-stone-300 px-6 py-4 text-center font-bold text-stone-900" href="#admin">View dashboard</a>
          </div>
        </div>
        <div className="rounded-[2rem] bg-gradient-to-br from-rose-200 via-amber-100 to-emerald-100 p-6 shadow-2xl">
          <div className="rounded-[1.5rem] bg-white/80 p-6 backdrop-blur">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-rose-700">MVP modules</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {['Products', 'Inventory', 'Storefront', 'Cart', 'Checkout', 'Orders'].map((item) => (
                <span key={item} className="rounded-2xl bg-white px-4 py-5 text-center font-bold shadow-sm">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-rose-700">Storefront</p>
            <h2 className="mt-2 text-4xl font-black text-stone-950">Featured crochet products</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => <button key={category} className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-bold text-stone-700">{category}</button>)}
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section id="checkout" className="mx-auto grid max-w-7xl gap-6 px-6 py-14 md:grid-cols-3">
        {[
          ["Secure checkout", "Guest and customer accounts can complete orders with address collection and payment handoff."],
          ["Realtime stock", "Inventory transactions are designed to adjust stock as carts convert to paid orders."],
          ["Order history", "Customers can review previous purchases while admins manage fulfillment states."],
        ].map(([title, copy]) => (
          <article key={title} className="rounded-3xl border border-rose-100 bg-white p-6 shadow-sm"><h3 className="text-xl font-black">{title}</h3><p className="mt-3 leading-7 text-stone-600">{copy}</p></article>
        ))}
      </section>

      <div className="mx-auto max-w-7xl px-6 py-14"><AdminDashboard /></div>
    </main>
  );
}
