# Crochetella

Crochetella is a single-business e-commerce platform for handmade crochet products. It is built with Next.js 15, TypeScript, Tailwind CSS, and Supabase-ready data modeling.

## MVP scope

- SEO-friendly customer storefront with featured products and category filters.
- Cart and checkout entry points for guest or registered customers.
- Admin operations dashboard for orders, revenue, and low-stock inventory.
- Supabase schema covering products, categories, images, carts, customers, addresses, orders, order items, and inventory transactions.

## Development

```bash
npm install
npm run dev
```

## Docker

Copy `.env.example` to `.env.local`, fill in Supabase values, then run:

```bash
docker compose up --build
```

The app is served at <http://localhost:3000>. The Docker image builds the Next.js standalone server, so `next.config.ts` keeps `output: "standalone"` enabled.

## Supabase credentials needed

To wire the database side, provide these values from your Supabase project:

1. `NEXT_PUBLIC_SUPABASE_URL` — Project URL from Supabase project settings.
2. `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Public publishable key for browser-safe reads and authenticated customer requests.
3. `SUPABASE_SERVICE_ROLE_KEY` — Server-only service role key for migrations/admin-only scripts. Do not paste this into client code or commit it.
4. Supabase project ref and database password if you want CLI-driven migrations against the remote project.
5. Storage bucket name preference for product images, or confirm `product-images` is acceptable.

Once those are available, the next database implementation step is to convert `supabase/schema.sql` and `DATABASE.md` into ordered migrations, add RLS policies, and generate typed Supabase clients.

## Validation

```bash
npm run typecheck
npm run build
```

## Buyer authentication

Buyer sign-in and sign-up pages are available at `/auth/sign-in` and `/auth/sign-up`. They use Supabase Auth with the browser publishable key from `.env.local`. When Supabase email confirmation is enabled, new buyers will need to confirm their email before signing in.

## Creating database tables and seeding an admin

Use the SQL migration in `supabase/migrations/20260719150000_initial_commerce_schema.sql` to create the first set of commerce tables and policies. You can apply it with the Supabase SQL editor, a privileged Postgres connection, or the Supabase CLI after linking the project.

To seed an admin:

1. Create or invite the admin user in Supabase Authentication.
2. Copy the user's Auth UUID and email.
3. Update `supabase/seed/seed_admin.sql` with that UUID and email.
4. Run the seed SQL with a privileged database connection.

The admin user is intentionally seeded from an existing Supabase Auth user so passwords and MFA remain managed by Supabase Auth rather than by application SQL.


## Supabase SSR session handling

Supabase browser, server, and middleware helpers live in `src/utils/supabase`. Middleware calls `supabase.auth.getUser()` on matched requests so auth cookies stay refreshed for buyer sessions.
