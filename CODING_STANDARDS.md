# Crochetella Coding Standards

## TypeScript

- Keep `strict` mode enabled.
- Prefer explicit domain types for data crossing module boundaries.
- Do not use `any`; use `unknown` and narrow when necessary.
- Represent money as integer cents in code and database records.
- Represent persisted timestamps as ISO strings in API responses.
- Keep validation schemas close to route handlers or form actions.
- Never trust client-provided IDs for ownership; derive user/customer identity from the server session.

## React and Next.js

- Use Server Components by default.
- Add `'use client'` only for stateful browser interactivity.
- Use Server Actions for first-party form mutations when possible.
- Use Route Handlers for external integrations, webhooks, and stable REST contracts.
- Use `next/image` for product imagery.
- Generate metadata for SEO-relevant pages.
- Keep loading and error UI colocated with routes.
- Avoid wrapping imports in `try/catch` blocks.

## Styling

- Use Tailwind utility classes and shared component variants.
- Prefer semantic HTML before custom ARIA.
- Keep color meaning consistent: rose for primary action, amber for warning, emerald for success, stone for neutral/admin.
- Ensure responsive layouts are designed mobile-first.

## Database access

- All Supabase calls must go through helpers under `src/lib/db` once implemented.
- Browser clients may use only public anon configuration.
- Service role clients must be server-only and isolated from client bundles.
- Mutations must validate input and authorization before writing.
- Inventory changes must be represented by ledger transactions, not direct stock edits, unless done inside a controlled migration.

## API and validation

- Return stable error codes from `API.md`.
- Reject unknown fields in mutating request payloads.
- Recompute prices, totals, and inventory availability on the server.
- Webhooks must verify signatures before parsing trusted event details.
- Keep route handlers small; move business rules to `src/lib/commerce`.

## Testing

Minimum checks before merging:

1. `npm run lint`
2. `npm run typecheck`
3. `npm run build`
4. Unit tests for changed commerce helpers.
5. Integration or e2e tests for changed checkout, auth, or admin flows.

Testing conventions:

- Unit tests should cover pure helpers and validation logic.
- Integration tests should cover route handlers and database policies.
- E2E tests should cover user-critical flows only.
- Add regression tests for bug fixes.

## Naming

- Components: `PascalCase.tsx`.
- Hooks: `useThing.ts`.
- Utilities: `camelCase.ts`.
- Database columns: `snake_case`.
- API JSON fields: `camelCase`.
- Route segments: lowercase kebab-case.
- SQL migrations: timestamp prefix plus concise verb phrase.

## Git conventions

- Commits should be small and describe the user-visible change.
- PR descriptions should include summary, testing, and migration notes when applicable.
- Never commit secrets, local `.env` files, `.next`, `node_modules`, or generated build artifacts.
- Include screenshots for perceptible UI changes when a runnable environment is available.

## Accessibility

- Use buttons for actions and anchors for navigation.
- Every form control must have a label.
- Use `aria-live` for async cart updates where needed.
- Dialogs must trap focus and close on Escape.
- Do not communicate status by color alone.

## Performance

- Avoid unnecessary Client Components.
- Paginate large lists.
- Cache public catalog reads with an explicit revalidation strategy.
- Optimize image sizes and alt text.
- Keep Lighthouse scores above 90 for performance, accessibility, best practices, and SEO.
