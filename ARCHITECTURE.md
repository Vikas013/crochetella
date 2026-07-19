# Crochetella Architecture

## System overview

Crochetella is a single-business commerce application that separates the public storefront from operational admin workflows while sharing one Supabase-backed domain model.

```text
Customer Browser
  -> Next.js App Router storefront routes
  -> Server actions / route handlers
  -> Supabase Postgres, Auth, Storage, Realtime

Admin Browser
  -> Protected Next.js admin routes
  -> Server actions / route handlers
  -> Supabase service-role-only admin workflows where required
```

## Runtime responsibilities

- **Next.js App Router** renders SEO-friendly storefront pages, protected admin pages, API route handlers, and server actions.
- **Supabase Postgres** stores catalog, inventory, cart, customer, and order state.
- **Supabase Auth** identifies customers and admins.
- **Supabase Storage** stores product images under private/admin write rules and public read rules for active products.
- **Supabase Realtime** can broadcast inventory and order status changes to admin dashboards.
- **Vercel** hosts the web runtime, preview deployments, environment variables, and image optimization.

## Module boundaries

| Module | Owns | Must not own |
| --- | --- | --- |
| Authentication | Session lookup, customer identity, admin role checks | Product pricing, order totals |
| Storefront | Browse/search/filter, product detail pages, SEO metadata | Admin-only mutations |
| Product Management | Product CRUD, image metadata, active/draft state | Checkout payment capture |
| Categories | Category CRUD and product grouping | Inventory adjustments |
| Inventory | Stock counts, transaction ledger, low-stock reporting | Customer address data |
| Cart | Guest/customer carts and cart item quantities | Permanent order history |
| Checkout | Address capture, order draft creation, payment handoff | Product authoring |
| Orders | Order state machine, order items, fulfillment status | Product image upload |
| Customers | Customer profile, addresses, order history access | Admin analytics calculations |
| Dashboard | Aggregated operational metrics | Source-of-truth transactions |
| Settings | Business profile, shipping/tax/payment configuration | Runtime secrets in source code |

## Folder structure

```text
src/
  app/
    (storefront)/        Public catalog, product, cart, checkout, account routes
    admin/               Protected admin dashboard and CRUD pages
    api/                 REST route handlers for external integrations
    globals.css          Global Tailwind theme imports
    layout.tsx           Root document and metadata defaults
  components/
    storefront/          Customer-facing reusable UI
    admin/               Admin reusable UI
    shared/              Cross-context primitives
  lib/
    auth/                Supabase auth helpers and role checks
    db/                  Supabase clients, query helpers, generated types
    validation/          Request and form schemas
    commerce/            Pricing, inventory, order state helpers
  tests/                 Unit, integration, and e2e helpers
supabase/
  migrations/            Ordered SQL migrations
  schema.sql             Current consolidated schema reference
docs or root *.md        Product, architecture, API, UI, and standards documentation
```

The current scaffold uses a simplified `src/app`, `src/components`, and `src/lib` structure. Feature directories should be introduced as modules become larger than a few files.

## Data flow

### Storefront browsing

1. Route loads active categories and active products from Supabase.
2. Product lists are cached with short revalidation windows.
3. Product detail pages fetch product, image, and stock availability by slug.
4. Metadata is generated from product title, description, canonical URL, and image.

### Cart and checkout

1. Anonymous users receive a signed cart session cookie.
2. Authenticated customers bind carts to `customers.id`.
3. Cart writes validate product existence, active state, and stock availability.
4. Checkout creates an order inside a database transaction.
5. Inventory is decremented by inserting `inventory_transactions`; triggers update product stock.
6. Payment provider callbacks transition orders from `new` to `paid` only after signature verification.

### Admin management

1. Admin routes require an authenticated Supabase user with an `admin` role claim or `admin_users` membership.
2. Mutations run through server actions or route handlers and validate all input.
3. Product, category, inventory, and order changes write audit-friendly timestamps and ledger rows.
4. Admin dashboard metrics read from views or optimized aggregate queries.

## API conventions

- All API routes live under `/api` and return JSON.
- Success responses use `{ "data": ... }`.
- Validation errors use HTTP `422` and a stable field-error payload.
- Authentication failures use `401`; authorization failures use `403`.
- Mutating requests require CSRF protection for browser form flows or signed webhook verification for third-party calls.
- API handlers never trust client-provided prices, totals, stock counts, customer IDs, or order statuses.

## Security model

- Enable RLS on every application table.
- Store admin capabilities in Supabase Auth claims or an `admin_users` table.
- Use anon keys only in browser-safe clients.
- Use service role keys only on trusted server paths and never expose them to client bundles.
- Treat payment webhooks as untrusted until signatures and event freshness are verified.
- Keep inventory mutations append-only through `inventory_transactions` where possible.

## Performance strategy

- Prefer server components for storefront reads.
- Use `next/image` for responsive images and configured remote/storage patterns.
- Add indexes for slugs, foreign keys, order status, customer order history, and cart lookup.
- Keep product cards lightweight and avoid client JavaScript unless interaction requires it.
- Use pagination for admin tables and customer history.

## Deployment environments

| Environment | Purpose | Data |
| --- | --- | --- |
| Local | Development and unit tests | Local Supabase or seeded dev database |
| Preview | Pull request validation | Isolated preview Supabase project or branch |
| Production | Customer traffic | Production Supabase and Vercel project |

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `PAYMENT_WEBHOOK_SECRET`
