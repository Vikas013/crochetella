import { orders, products } from "@/lib/data";

const statusStyles = {
  new: "bg-blue-100 text-blue-800",
  paid: "bg-emerald-100 text-emerald-800",
  making: "bg-amber-100 text-amber-800",
  shipped: "bg-purple-100 text-purple-800",
};

export function AdminDashboard() {
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const lowStock = products.filter((product) => product.stock <= 5).length;

  return (
    <section id="admin" className="rounded-[2rem] bg-stone-950 p-6 text-white shadow-2xl md:p-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-300">Admin workspace</p>
          <h2 className="mt-2 text-3xl font-black">Operations dashboard</h2>
        </div>
        <button className="rounded-full bg-rose-200 px-5 py-3 font-bold text-stone-950">Add product</button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Monthly revenue" value={`$${revenue.toLocaleString()}`} />
        <Metric label="Open orders" value={orders.length.toString()} />
        <Metric label="Low stock items" value={lowStock.toString()} />
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
        <div className="grid grid-cols-4 bg-white/10 px-4 py-3 text-sm font-bold text-rose-100">
          <span>Order</span><span>Customer</span><span>Total</span><span>Status</span>
        </div>
        {orders.map((order) => (
          <div key={order.id} className="grid grid-cols-4 items-center border-t border-white/10 px-4 py-4 text-sm">
            <span className="font-bold">{order.id}</span>
            <span>{order.customer}</span>
            <span>${order.total}</span>
            <span><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[order.status]}`}>{order.status}</span></span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-white/10 p-5"><p className="text-sm text-rose-100">{label}</p><p className="mt-2 text-3xl font-black">{value}</p></div>;
}
