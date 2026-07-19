-- Crochetella MVP schema for Supabase Postgres.
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text not null,
  price_cents integer not null check (price_cents >= 0),
  stock integer not null default 0 check (stock >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  storage_path text not null,
  alt text not null,
  sort_order integer not null default 0
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email text not null unique,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  line1 text not null,
  line2 text,
  city text not null,
  region text not null,
  postal_code text not null,
  country text not null default 'US'
);

create table if not exists carts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade,
  session_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references carts(id) on delete cascade,
  product_id uuid not null references products(id),
  quantity integer not null check (quantity > 0),
  unique(cart_id, product_id)
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id),
  status text not null default 'new' check (status in ('new', 'paid', 'making', 'shipped', 'cancelled')),
  total_cents integer not null check (total_cents >= 0),
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0)
);

create table if not exists inventory_transactions (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  delta integer not null,
  reason text not null,
  order_id uuid references orders(id),
  created_at timestamptz not null default now()
);

alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table customers enable row level security;
alter table addresses enable row level security;
alter table carts enable row level security;
alter table cart_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table inventory_transactions enable row level security;

create table if not exists admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'owner' check (role in ('owner', 'manager', 'maker')),
  created_at timestamptz not null default now()
);

alter table admin_users enable row level security;

create or replace function is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from admin_users where user_id = auth.uid());
$$;

create policy "Public can read categories" on categories for select using (true);
create policy "Public can read active products" on products for select using (active = true);
create policy "Public can read product images for active products" on product_images for select using (
  exists (select 1 from products where products.id = product_images.product_id and products.active = true)
);

create policy "Admins manage admin users" on admin_users for all using (is_admin()) with check (is_admin());
create policy "Admins manage categories" on categories for all using (is_admin()) with check (is_admin());
create policy "Admins manage products" on products for all using (is_admin()) with check (is_admin());
create policy "Admins manage product images" on product_images for all using (is_admin()) with check (is_admin());
create policy "Admins manage inventory" on inventory_transactions for all using (is_admin()) with check (is_admin());
create policy "Admins manage customers" on customers for all using (is_admin()) with check (is_admin());
create policy "Admins manage addresses" on addresses for all using (is_admin()) with check (is_admin());
create policy "Admins manage carts" on carts for all using (is_admin()) with check (is_admin());
create policy "Admins manage cart items" on cart_items for all using (is_admin()) with check (is_admin());
create policy "Admins manage orders" on orders for all using (is_admin()) with check (is_admin());
create policy "Admins manage order items" on order_items for all using (is_admin()) with check (is_admin());

create policy "Customers read own profile" on customers for select using (auth_user_id = auth.uid());
create policy "Customers update own profile" on customers for update using (auth_user_id = auth.uid()) with check (auth_user_id = auth.uid());
create policy "Customers manage own addresses" on addresses for all using (
  exists (select 1 from customers where customers.id = addresses.customer_id and customers.auth_user_id = auth.uid())
) with check (
  exists (select 1 from customers where customers.id = addresses.customer_id and customers.auth_user_id = auth.uid())
);
create policy "Customers read own orders" on orders for select using (
  exists (select 1 from customers where customers.id = orders.customer_id and customers.auth_user_id = auth.uid())
);
create policy "Customers read own order items" on order_items for select using (
  exists (
    select 1 from orders
    join customers on customers.id = orders.customer_id
    where orders.id = order_items.order_id and customers.auth_user_id = auth.uid()
  )
);
