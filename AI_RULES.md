# AI Rules for Crochetella

These rules are mandatory for coding assistants working on Crochetella.

## Product constraints

- Build for a single crochet business, not a multi-vendor marketplace.
- Prioritize MVP modules: product management, inventory, storefront, cart, checkout, orders, and dashboard.
- Future modules such as coupons, reviews, wishlist, WhatsApp notifications, analytics, and shipping integrations must not complicate the MVP architecture.

## Architecture constraints

- Use Next.js App Router patterns.
- Use Server Components by default.
- Isolate browser-only interactivity in explicit Client Components.
- Keep business rules out of UI components.
- Keep database access behind Supabase helper modules.
- Do not bypass RLS from client-side code.
- Do not expose service role keys, webhook secrets, or admin-only queries to the browser.

## Package preferences

- Prefer built-in Next.js, React, TypeScript, and Supabase capabilities before adding dependencies.
- Add UI libraries only with a clear reason and after documenting the tradeoff.
- Use lightweight validation and testing tools that work well in CI.
- Do not add state management libraries unless local React state and server data patterns are insufficient.

## Security requirements

- Enable and maintain RLS for every application table.
- Validate all route handler and server action inputs.
- Derive customer/admin identity from the authenticated server session.
- Never trust client-provided prices, totals, stock counts, roles, or order statuses.
- Verify payment webhook signatures and idempotency.
- Store product images with clear public-read/admin-write policies.
- Avoid logging secrets, full payment payloads, or sensitive customer data.

## Code quality rules

- Keep TypeScript strict and resolve type errors before marking work complete.
- Do not use `any` unless a short comment explains why no safer type is available.
- Do not put `try/catch` blocks around imports.
- Prefer small, named functions over large route handlers.
- Keep components focused on presentation and composition.
- Add tests for non-trivial business logic and critical user flows.
- Update documentation when changing architecture, API contracts, database schema, or workflows.

## Database rules

- Use integer cents for money.
- Use append-only `inventory_transactions` for stock changes.
- Keep order item prices and names as immutable snapshots.
- Add indexes when introducing new lookup/filter patterns.
- Add migrations for schema changes; do not rely only on the consolidated schema file.
- Include rollback notes when migrations are risky or destructive.

## UI rules

- Preserve a warm handmade visual identity.
- Design mobile-first.
- Ensure controls are keyboard accessible.
- Add loading, empty, success, and error states for user-facing flows.
- Use clear stock messaging and do not allow checkout of unavailable quantities.

## Definition of done

A task is done only when:

1. The implementation satisfies the relevant PRD requirement.
2. TypeScript, lint, and build checks pass or an environment limitation is documented.
3. Relevant tests are added or updated.
4. RLS and authorization implications are reviewed for data changes.
5. User-facing UI has responsive and accessibility considerations.
6. Documentation is updated for changed architecture, APIs, schema, or workflows.
7. The final response lists changed files and exact validation commands.

## Prohibited shortcuts

- Do not hard-code secrets.
- Do not directly mutate product stock from UI code.
- Do not create admin endpoints without authorization checks.
- Do not create checkout flows that trust client totals.
- Do not ignore failed validation or failed tests without documenting why.
- Do not introduce marketplace/multi-tenant assumptions unless explicitly requested.
