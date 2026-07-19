# Crochetella Implementation Tasks

Statuses are intentionally omitted so this file can be used as a planning backlog. Dependencies refer to task numbers.

## Foundation

1. Initialize Next.js 15 App Router project with TypeScript. Dependencies: none.
2. Configure Tailwind CSS and global design tokens. Dependencies: 1.
3. Add ESLint, TypeScript strict mode, and formatting conventions. Dependencies: 1.
4. Create base folder structure for storefront, admin, shared components, commerce helpers, and database helpers. Dependencies: 1.
5. Define environment variable contract and validation helper. Dependencies: 1.
6. Configure Supabase browser and server clients. Dependencies: 5.
7. Add generated database type workflow from Supabase CLI. Dependencies: 6.
8. Create seed data script for local development. Dependencies: 6.

## Database and security

9. Create categories migration. Dependencies: 6.
10. Create products migration. Dependencies: 9.
11. Create product images migration. Dependencies: 10.
12. Create customers and addresses migrations. Dependencies: 6.
13. Create carts and cart items migrations. Dependencies: 10, 12.
14. Create orders and order items migrations. Dependencies: 10, 12.
15. Create inventory transactions migration. Dependencies: 10, 14.
16. Add indexes for slugs, foreign keys, carts, orders, and inventory lookups. Dependencies: 9-15.
17. Add updated-at trigger helper and attach it to mutable tables. Dependencies: 9-15.
18. Add stock adjustment trigger from inventory transactions. Dependencies: 15.
19. Add RLS policies for public active catalog reads. Dependencies: 9-11.
20. Add RLS policies for customers to manage their own profile, addresses, carts, and orders. Dependencies: 12-14.
21. Add RLS policies for admin users to manage catalog, inventory, customers, and orders. Dependencies: 9-15.
22. Add database tests for RLS access paths. Dependencies: 19-21.

## Storefront

23. Build home page hero and featured product section. Dependencies: 2, 10.
24. Build product listing page with pagination. Dependencies: 10, 11.
25. Add category filter route and query handling. Dependencies: 9, 24.
26. Add search by name/description/category. Dependencies: 24.
27. Build product detail page with image gallery and stock status. Dependencies: 10, 11.
28. Generate SEO metadata for home, listing, category, and product pages. Dependencies: 23-27.
29. Add structured data for products and breadcrumbs. Dependencies: 27, 28.
30. Add loading, empty, and not-found states. Dependencies: 24-27.
31. Add responsive QA pass for mobile, tablet, and desktop breakpoints. Dependencies: 23-30.

## Cart and checkout

32. Implement guest cart session cookie. Dependencies: 13.
33. Implement cart lookup and merge behavior for authenticated customers. Dependencies: 12, 13, 32.
34. Add add-to-cart server action with stock validation. Dependencies: 13, 18.
35. Add cart page with quantity updates and removal. Dependencies: 34.
36. Add checkout page with contact and shipping address forms. Dependencies: 12, 35.
37. Add order creation transaction from cart. Dependencies: 14, 15, 18, 36.
38. Add payment provider handoff abstraction. Dependencies: 37.
39. Add signed payment webhook route. Dependencies: 38.
40. Add confirmation page and order receipt. Dependencies: 37-39.
41. Add abandoned cart cleanup job or scheduled function. Dependencies: 13, 32.

## Authentication and account

42. Add customer sign-up, login, logout, and password reset pages. Dependencies: 6, 12.
43. Add account layout protected by customer session. Dependencies: 42.
44. Add order history page. Dependencies: 14, 43.
45. Add saved addresses page. Dependencies: 12, 43.
46. Add profile update form. Dependencies: 12, 43.

## Admin

47. Define admin authorization model and role assignment process. Dependencies: 6.
48. Add protected admin layout. Dependencies: 47.
49. Build dashboard metrics cards. Dependencies: 14, 15, 48.
50. Build recent orders table. Dependencies: 14, 48.
51. Build product list table with search and status filters. Dependencies: 10, 48.
52. Build product create/edit form. Dependencies: 10, 11, 51.
53. Build product image upload to Supabase Storage. Dependencies: 11, 52.
54. Build category CRUD screens. Dependencies: 9, 48.
55. Build inventory adjustment form with ledger reason. Dependencies: 15, 18, 51.
56. Build order detail page with fulfillment status updates. Dependencies: 14, 50.
57. Build customer list and customer detail pages. Dependencies: 12, 48.
58. Add admin audit log display if audit table is introduced. Dependencies: 47.
59. Add business settings page. Dependencies: 48.

## Quality and release

60. Add unit tests for commerce helpers. Dependencies: 34, 37.
61. Add integration tests for cart and checkout route handlers. Dependencies: 35-40.
62. Add e2e tests for browse-to-checkout happy path. Dependencies: 23-40.
63. Add e2e tests for admin product CRUD and order update flows. Dependencies: 48-56.
64. Add accessibility pass for forms, navigation, and product cards. Dependencies: 23-59.
65. Add Lighthouse budget check for storefront pages. Dependencies: 23-31.
66. Add image optimization and alt text review. Dependencies: 27, 53.
67. Add production environment checklist. Dependencies: 5, 38, 47.
68. Add monitoring and error reporting. Dependencies: 38, 39, 67.
69. Add database backup and recovery notes. Dependencies: 9-22.
70. Prepare MVP launch QA and rollback plan. Dependencies: 60-69.
