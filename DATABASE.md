# Crochetella Database Design

This document is the canonical Supabase/Postgres database plan. The implementation can be split into timestamped files under `supabase/migrations` while keeping `supabase/schema.sql` as a consolidated reference.

## Extensions

```sql
create extension if not exists pgcrypto;
create extension if not exists citext;
```

## Tables

### `admin_users`

Stores explicit admin membership when auth claims are not sufficient.

| Column | Type | Rules |
| --- | --- | --- |
| `user_id` | `uuid` | primary key, references `auth.users(id)` on delete cascade |
| `role` | `text` | `owner`, `manager`, or `maker` |
| `created_at` | `timestamptz` | default `now()` |

### `categories`

| Column | Type | Rules |
| --- | --- | --- |
| `id` | `uuid` | primary key, default `gen_random_uuid()` |
| `name` | `text` | required, unique |
| `slug` | `text` | required, unique, lowercase URL segment |
| `description` | `text` | optional |
| `sort_order` | `integer` | default `0` |
| `created_at` | `timestamptz` | default `now()` |
| `updated_at` | `timestamptz` | default `now()` |

### `products`

| Column | Type | Rules |
| --- | --- | --- |
| `id` | `uuid` | primary key |
| `category_id` | `uuid` | references `categories(id)` on delete set null |
| `name` | `text` | required |
| `slug` | `text` | required, unique |
| `description` | `text` | required |
| `materials` | `text` | optional |
| `care_instructions` | `text` | optional |
| `price_cents` | `integer` | required, `>= 0` |
| `compare_at_price_cents` | `integer` | optional, `>= price_cents` when present |
| `stock` | `integer` | required, default `0`, `>= 0` |
| `low_stock_threshold` | `integer` | required, default `3`, `>= 0` |
| `active` | `boolean` | required, default `false` |
| `featured` | `boolean` | required, default `false` |
| `created_at` | `timestamptz` | default `now()` |
| `updated_at` | `timestamptz` | default `now()` |

### `product_images`

| Column | Type | Rules |
| --- | --- | --- |
| `id` | `uuid` | primary key |
| `product_id` | `uuid` | required, references `products(id)` on delete cascade |
| `storage_path` | `text` | required |
| `alt` | `text` | required |
| `sort_order` | `integer` | default `0` |
| `created_at` | `timestamptz` | default `now()` |

### `customers`

| Column | Type | Rules |
| --- | --- | --- |
| `id` | `uuid` | primary key |
| `auth_user_id` | `uuid` | unique, references `auth.users(id)` on delete set null |
| `email` | `citext` | required, unique |
| `full_name` | `text` | optional |
| `phone` | `text` | optional |
| `created_at` | `timestamptz` | default `now()` |
| `updated_at` | `timestamptz` | default `now()` |

### `addresses`

| Column | Type | Rules |
| --- | --- | --- |
| `id` | `uuid` | primary key |
| `customer_id` | `uuid` | required, references `customers(id)` on delete cascade |
| `label` | `text` | optional |
| `line1` | `text` | required |
| `line2` | `text` | optional |
| `city` | `text` | required |
| `region` | `text` | required |
| `postal_code` | `text` | required |
| `country` | `text` | required, default `US` |
| `created_at` | `timestamptz` | default `now()` |

### `carts`

| Column | Type | Rules |
| --- | --- | --- |
| `id` | `uuid` | primary key |
| `customer_id` | `uuid` | optional, references `customers(id)` on delete cascade |
| `session_id` | `text` | optional signed anonymous cart identifier |
| `status` | `text` | `active`, `converted`, or `abandoned` |
| `created_at` | `timestamptz` | default `now()` |
| `updated_at` | `timestamptz` | default `now()` |

### `cart_items`

| Column | Type | Rules |
| --- | --- | --- |
| `id` | `uuid` | primary key |
| `cart_id` | `uuid` | required, references `carts(id)` on delete cascade |
| `product_id` | `uuid` | required, references `products(id)` |
| `quantity` | `integer` | required, `> 0` |
| `created_at` | `timestamptz` | default `now()` |
| `updated_at` | `timestamptz` | default `now()` |

Unique constraint: `(cart_id, product_id)`.

### `orders`

| Column | Type | Rules |
| --- | --- | --- |
| `id` | `uuid` | primary key |
| `customer_id` | `uuid` | optional, references `customers(id)` |
| `email` | `citext` | required for guest and registered orders |
| `status` | `text` | `new`, `paid`, `making`, `shipped`, `cancelled`, or `refunded` |
| `subtotal_cents` | `integer` | required, `>= 0` |
| `shipping_cents` | `integer` | required, `>= 0` |
| `tax_cents` | `integer` | required, `>= 0` |
| `total_cents` | `integer` | required, `>= 0` |
| `shipping_address` | `jsonb` | required immutable checkout snapshot |
| `payment_provider` | `text` | optional |
| `payment_reference` | `text` | optional, unique when present |
| `created_at` | `timestamptz` | default `now()` |
| `updated_at` | `timestamptz` | default `now()` |

### `order_items`

| Column | Type | Rules |
| --- | --- | --- |
| `id` | `uuid` | primary key |
| `order_id` | `uuid` | required, references `orders(id)` on delete cascade |
| `product_id` | `uuid` | required, references `products(id)` |
| `product_name` | `text` | immutable product name snapshot |
| `quantity` | `integer` | required, `> 0` |
| `unit_price_cents` | `integer` | required, `>= 0` |
| `line_total_cents` | `integer` | required, `>= 0` |

### `inventory_transactions`

| Column | Type | Rules |
| --- | --- | --- |
| `id` | `uuid` | primary key |
| `product_id` | `uuid` | required, references `products(id)` on delete cascade |
| `delta` | `integer` | required, positive for restock, negative for sale/adjustment |
| `reason` | `text` | `initial`, `restock`, `sale`, `manual_adjustment`, `return`, or `correction` |
| `order_id` | `uuid` | optional, references `orders(id)` |
| `created_by` | `uuid` | optional, references `auth.users(id)` |
| `created_at` | `timestamptz` | default `now()` |

## Indexes

```sql
create index categories_slug_idx on categories(slug);
create index products_slug_idx on products(slug);
create index products_category_active_idx on products(category_id, active);
create index products_active_featured_idx on products(active, featured);
create index product_images_product_sort_idx on product_images(product_id, sort_order);
create index customers_auth_user_idx on customers(auth_user_id);
create index carts_customer_status_idx on carts(customer_id, status);
create index carts_session_status_idx on carts(session_id, status);
create index cart_items_cart_idx on cart_items(cart_id);
create index orders_customer_created_idx on orders(customer_id, created_at desc);
create index orders_status_created_idx on orders(status, created_at desc);
create index order_items_order_idx on order_items(order_id);
create index inventory_transactions_product_created_idx on inventory_transactions(product_id, created_at desc);
```

## Triggers

### `set_updated_at`

```sql
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
```

Attach this trigger to `categories`, `products`, `customers`, `carts`, `cart_items`, and `orders`.

### `apply_inventory_delta`

```sql
create or replace function apply_inventory_delta()
returns trigger language plpgsql as $$
begin
  update products
  set stock = stock + new.delta,
      updated_at = now()
  where id = new.product_id;

  if exists (select 1 from products where id = new.product_id and stock < 0) then
    raise exception 'Insufficient stock for product %', new.product_id;
  end if;

  return new;
end;
$$;

create trigger inventory_transactions_apply_delta
  after insert on inventory_transactions
  for each row execute function apply_inventory_delta();
```

## RLS helper functions

```sql
create or replace function is_admin()
returns boolean language sql stable security definer as $$
  select exists (select 1 from admin_users where user_id = auth.uid());
$$;

create or replace function current_customer_id()
returns uuid language sql stable security definer as $$
  select id from customers where auth_user_id = auth.uid() limit 1;
$$;
```

## RLS policy matrix

| Table | Public | Customer | Admin |
| --- | --- | --- | --- |
| `categories` | select active catalog categories | select | all |
| `products` | select `active = true` | select `active = true` | all |
| `product_images` | select images for active products | select images for active products | all |
| `customers` | none | select/update own row | all |
| `addresses` | none | CRUD own addresses | all |
| `carts` | CRUD by signed session through server routes | CRUD own active carts | all |
| `cart_items` | CRUD through owned cart | CRUD through owned cart | all |
| `orders` | insert through checkout route only | select own orders | all |
| `order_items` | none | select own order items | all |
| `inventory_transactions` | none | none | all |

## Migration order

1. Extensions and helper functions.
2. Admin users.
3. Catalog tables.
4. Customer and address tables.
5. Cart tables.
6. Order tables.
7. Inventory ledger and triggers.
8. Indexes.
9. RLS policies.
10. Storage bucket and storage policies for product images.
