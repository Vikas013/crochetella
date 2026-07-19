# Crochetella UI and UX Specification

## Design principles

- Warm, handmade, trustworthy, and simple.
- Prioritize product photography, clear prices, and stock confidence.
- Keep checkout short enough for guest customers.
- Make admin workflows fast on laptop and usable on tablet.
- Every interactive element must have visible focus states and accessible labels.

## Visual system

| Token | Usage |
| --- | --- |
| Cream background | Storefront page background and soft sections |
| Rose accent | Primary calls to action and badges |
| Stone text | Primary copy and admin shell |
| Amber highlight | Price chips and inventory warning accents |
| Emerald success | In-stock and paid states |

Typography:

- Use a bold display treatment for hero and section headings.
- Use readable sans-serif body text with line height of at least `1.6` for descriptions.
- Avoid text over busy images unless a strong overlay is present.

## Shared components

### Header

- Left: Crochetella logo text.
- Center/right desktop: `Shop`, `Admin`, `Checkout` or account links.
- Right: cart pill with item count.
- Mobile: compact logo, cart pill, and menu trigger.

### Product card

Content order:

1. Product image.
2. Category eyebrow.
3. Product name.
4. Price.
5. Short description.
6. Stock status.
7. Add-to-cart button.

States:

- In stock: show stock count.
- Low stock: show amber warning.
- Out of stock: disable add-to-cart and show waitlist/future placeholder.

### Form fields

- Label is always visible.
- Help text appears below when needed.
- Error text appears below and is connected with `aria-describedby`.
- Required fields use text, not color alone.

### Data table

- Columns remain readable on desktop.
- On mobile, rows collapse into cards.
- Filters are above the table.
- Empty state includes a recommended action.

## Storefront pages

### Home page

Purpose: introduce the business and direct users to products.

Sections:

1. Header with cart count.
2. Hero with value proposition and primary `Browse products` CTA.
3. MVP/product category highlights.
4. Featured product grid.
5. Checkout reassurance cards.
6. Footer with business/contact/social links.

Wireframe:

```text
[Logo]                         [Shop] [Account] [Cart]

[Handmade crochet commerce]
[Large headline...............................] [MVP module card]
[Supporting copy..............................] [Products Inventory]
[Browse products] [Custom order info]          [Cart Checkout]

[Storefront] [Category filter pills]
[Product card] [Product card] [Product card]

[Secure checkout] [Realtime stock] [Order history]
```

### Product listing page

Requirements:

- Search input.
- Category filter.
- Sort by newest, price ascending, price descending, and featured.
- Paginated grid.
- Empty state: “No crochet pieces match those filters.”

### Product detail page

Requirements:

- Image gallery with thumbnails.
- Product title, category, price, stock status.
- Quantity selector constrained by stock.
- Add-to-cart CTA.
- Description, materials, care instructions, shipping note.
- Related products from same category.

### Cart page

Requirements:

- Editable quantity for each item.
- Remove item action.
- Order summary with subtotal, estimated shipping, estimated tax, and total.
- Checkout CTA.
- Empty cart state linking back to products.

### Checkout page

Steps:

1. Contact email.
2. Shipping address.
3. Review items and totals.
4. Payment handoff.

Validation:

- Email format.
- Required address fields.
- Stock recheck on submit.

### Confirmation page

Requirements:

- Order number.
- Customer email.
- Summary of purchased items.
- Fulfillment expectation.
- Link to order history or storefront.

### Account pages

- Login/register/password reset.
- Order history list.
- Order detail view.
- Saved addresses.
- Profile settings.

## Admin pages

### Admin login

- Uses Supabase Auth.
- Shows generic authentication errors.
- Redirects authenticated admins to dashboard.

### Dashboard

Cards:

- Monthly revenue.
- Open orders.
- Low-stock items.
- Best-selling product.

Tables:

- Recent orders.
- Low stock products.

### Product management

List:

- Search by name or slug.
- Filter by category and active state.
- Columns: image, name, category, price, stock, active, updated date.

Form:

- Name, slug, category, description, materials, care instructions.
- Price in dollars, converted to cents.
- Low-stock threshold.
- Active and featured toggles.
- Image upload and alt text.

### Category management

- List categories with product counts.
- Create/edit modal or page.
- Prevent deletion of categories with products unless products are reassigned.

### Inventory management

- Product lookup.
- Current stock.
- Adjustment delta.
- Reason selector.
- Optional note.
- Recent transaction ledger.

### Order management

List:

- Filter by status.
- Search by order number, email, or customer name.
- Columns: order, customer, total, status, created date.

Detail:

- Customer/contact block.
- Shipping address.
- Items and totals.
- Status timeline.
- Fulfillment actions.

### Customer management

- Searchable customer table.
- Customer detail with profile, addresses, and order history.
- Admins cannot edit customer passwords.

## User flows

### Customer purchase flow

```text
Home -> Product listing -> Product detail -> Add to cart -> Cart -> Checkout -> Payment -> Confirmation
```

### Returning customer order history

```text
Login -> Account -> Orders -> Order detail
```

### Admin product launch flow

```text
Admin login -> Products -> Add product -> Upload images -> Set active -> Verify storefront page
```

### Admin fulfillment flow

```text
Admin login -> Orders -> Order detail -> Mark making -> Mark shipped
```

## Accessibility checklist

- Keyboard access for navigation, filters, forms, and modals.
- Focus rings visible on all controls.
- Product images include meaningful alt text.
- Color contrast meets WCAG AA.
- Form errors are announced and associated with fields.
- Tables have semantic headers.

## Responsive behavior

| Breakpoint | Behavior |
| --- | --- |
| Mobile | Single-column layout, card tables, sticky cart/checkout CTA where appropriate |
| Tablet | Two-column product grids, compact admin tables |
| Desktop | Three/four-column product grids, full admin data tables |
