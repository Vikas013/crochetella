# Crochetella API Specification

All endpoints return JSON. Browser UI should prefer server actions for first-party form submissions, but these REST contracts define stable route handler behavior for integrations, tests, and future clients.

## Response envelope

Success:

```json
{ "data": {} }
```

Validation failure:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed.",
    "fields": { "email": ["Enter a valid email address."] }
  }
}
```

## Error codes

| Code | HTTP | Meaning |
| --- | --- | --- |
| `UNAUTHENTICATED` | 401 | No valid session or token was supplied. |
| `FORBIDDEN` | 403 | The actor lacks the required role or ownership. |
| `NOT_FOUND` | 404 | The resource does not exist or is hidden by authorization. |
| `CONFLICT` | 409 | The request conflicts with current state, such as duplicate slug. |
| `OUT_OF_STOCK` | 409 | Requested quantity exceeds available stock. |
| `VALIDATION_ERROR` | 422 | Request body, path, or query parameters are invalid. |
| `RATE_LIMITED` | 429 | Too many requests. |
| `INTERNAL_ERROR` | 500 | Unexpected server error. |

## Validation conventions

- Strings are trimmed before validation.
- Slugs must match `^[a-z0-9]+(?:-[a-z0-9]+)*$`.
- Money is represented as integer cents.
- Quantities must be positive integers.
- Client-provided order totals are ignored; totals are computed server-side.
- Unknown fields are rejected for mutating endpoints.

## Public catalog endpoints

### `GET /api/products`

Query parameters:

| Name | Type | Rules |
| --- | --- | --- |
| `category` | string | optional category slug |
| `q` | string | optional search text, 2-80 chars |
| `featured` | boolean | optional |
| `page` | integer | default `1`, min `1` |
| `limit` | integer | default `12`, max `48` |

Response:

```json
{
  "data": {
    "items": [
      {
        "id": "uuid",
        "slug": "sunset-tote",
        "name": "Sunset Granny Square Tote",
        "priceCents": 6800,
        "stock": 6,
        "category": { "name": "Bags", "slug": "bags" },
        "image": { "url": "https://...", "alt": "Sunset tote" }
      }
    ],
    "page": 1,
    "limit": 12,
    "total": 1
  }
}
```

### `GET /api/products/:slug`

Returns one active product by slug.

Response fields include `id`, `name`, `slug`, `description`, `materials`, `careInstructions`, `priceCents`, `stock`, `category`, and sorted `images`.

### `GET /api/categories`

Returns categories sorted by `sort_order` and `name`.

## Cart endpoints

### `GET /api/cart`

Returns the active cart for the authenticated customer or signed anonymous session.

### `POST /api/cart/items`

Request:

```json
{ "productId": "uuid", "quantity": 1 }
```

Rules:

- Product must exist and be active.
- Quantity must not exceed stock.
- Existing cart line quantity is incremented.

### `PATCH /api/cart/items/:itemId`

Request:

```json
{ "quantity": 2 }
```

Rules:

- Quantity `0` is not accepted; use delete.
- Stock is revalidated against the final quantity.

### `DELETE /api/cart/items/:itemId`

Deletes an item from the active cart.

## Checkout and orders

### `POST /api/checkout`

Request:

```json
{
  "email": "customer@example.com",
  "shippingAddress": {
    "fullName": "Maya Chen",
    "line1": "123 Yarn St",
    "line2": "Apt 4",
    "city": "Portland",
    "region": "OR",
    "postalCode": "97201",
    "country": "US"
  }
}
```

Response:

```json
{
  "data": {
    "orderId": "uuid",
    "status": "new",
    "paymentUrl": "https://payments.example/checkout/session"
  }
}
```

Rules:

- Cart must contain at least one item.
- Product prices and stock are read in a transaction.
- Inventory is reserved or decremented only after the selected payment strategy allows it.
- Address is stored as an immutable order snapshot.

### `GET /api/orders`

Authenticated customer endpoint. Returns the customer's order history with pagination.

### `GET /api/orders/:id`

Authenticated customer endpoint. Returns the order if the customer owns it.

### `POST /api/webhooks/payments`

Payment provider webhook endpoint.

Rules:

- Verify signature with `PAYMENT_WEBHOOK_SECRET` before reading event data.
- Reject stale or replayed events.
- Transition order status idempotently.
- Never trust webhook totals without comparing to stored order totals.

## Admin endpoints

All admin endpoints require admin authorization.

### `GET /api/admin/products`

Supports `q`, `category`, `active`, `page`, and `limit` query parameters.

### `POST /api/admin/products`

Request:

```json
{
  "name": "Sunset Granny Square Tote",
  "slug": "sunset-granny-square-tote",
  "categoryId": "uuid",
  "description": "A sturdy cotton tote.",
  "materials": "Cotton yarn",
  "careInstructions": "Spot clean or hand wash.",
  "priceCents": 6800,
  "stock": 6,
  "lowStockThreshold": 3,
  "active": true,
  "featured": true
}
```

### `PATCH /api/admin/products/:id`

Allows partial updates to mutable product fields. Slug conflicts return `CONFLICT`.

### `DELETE /api/admin/products/:id`

Soft-deactivates a product by setting `active = false`. Hard deletes are not exposed in the API.

### `POST /api/admin/products/:id/images`

Creates product image metadata after an authorized Storage upload.

### `GET /api/admin/categories`

Lists all categories, including empty categories.

### `POST /api/admin/categories`

Creates a category with `name`, `slug`, optional `description`, and `sortOrder`.

### `PATCH /api/admin/categories/:id`

Updates category metadata.

### `DELETE /api/admin/categories/:id`

Deletes only when no products reference the category; otherwise returns `CONFLICT`.

### `POST /api/admin/inventory/adjustments`

Request:

```json
{
  "productId": "uuid",
  "delta": 5,
  "reason": "restock",
  "note": "Finished weekend batch"
}
```

Rules:

- `delta` cannot be `0`.
- Resulting stock cannot be negative.
- Every adjustment creates an `inventory_transactions` row.

### `GET /api/admin/orders`

Supports `status`, `q`, `page`, and `limit`.

### `PATCH /api/admin/orders/:id/status`

Request:

```json
{ "status": "making" }
```

Allowed transitions:

- `new -> paid`
- `paid -> making`
- `making -> shipped`
- `new|paid -> cancelled`
- `paid|making|shipped -> refunded` through explicit refund workflow

### `GET /api/admin/customers`

Supports customer search by email or name.

### `GET /api/admin/dashboard`

Returns revenue, open order counts, low-stock items, best sellers, and recent orders. Expensive metrics should use materialized views or cached aggregates as traffic grows.
