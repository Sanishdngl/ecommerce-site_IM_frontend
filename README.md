# E-Commerce + Inventory Management — Frontend

React + TypeScript SPA covering three surfaces off one codebase: public storefront, authenticated customer account/cart, and role-gated admin console (users, categories, products, bulk upload). Talks to the [gateway](../ecommerce-site_Inventory-Management/README.md) over REST; no direct service calls.

---

## Tech Stack

| Concern         | Library                                                                       |
| --------------- | ----------------------------------------------------------------------------- |
| Framework       | React 19 + TypeScript, Vite 8                                                 |
| Routing         | `react-router-dom` v6                                                         |
| Server state    | `@tanstack/react-query` v5                                                    |
| Client/UI state | `zustand` (no persist middleware — see [State Management](#state-management)) |
| Forms           | `react-hook-form` + `@hookform/resolvers`                                     |
| Validation      | `zod` v4                                                                      |
| HTTP            | `axios`, two isolated instances (admin/customer)                              |
| Styling         | Tailwind CSS v3                                                               |
| Tables          | `@tanstack/react-table`                                                       |
| Toasts          | `react-hot-toast`                                                             |
| Testing         | `vitest` + `@testing-library/react`, jsdom                                    |

---

## Project Structure

```
src/
├── pages/
│   ├── admin/
│   │   ├── LoginPage.tsx, DashboardPage.tsx, SystemCheckerPage.tsx
│   │   ├── users/                  # super_admin only
│   │   └── inventory/              # super_admin + maintainer (reporter: read-only)
│   └── public/
│       ├── HomePage, ProductsPage, ProductDetailPage, LoginPage, RegisterPage
│       └── customer/                # ProfilePage, CartPage — auth required
│
├── components/
│   ├── admin/                       # ProductForm, CategoryForm, BulkUploadForm, tables
│   ├── public/                      # ProductCard, AuthForm (incl. Google One Tap)
│   ├── guards/                      # AdminRoute, CustomerRoute, RoleRoute
│   └── common/                      # Table, Button, ConfirmDialog, ErrorBoundary
│
├── hooks/
│   ├── admin/                       # useAdminAuth, useAdminUsers, useBulkUpload
│   ├── customer/                    # useCustomerAuth, useCart, useProfile
│   └── inventory/                   # useCategories, useProducts
│
├── stores/                          # zustand — adminAuth, customerAuth, cart
├── lib/
│   ├── adminApi.ts, customerApi.ts  # separate axios instances, separate token spaces
│   ├── queryClient.ts, queryKeys.ts
│   ├── deviceId.ts                  # persisted device id, sent on OAuth login
│   └── schemas/                     # zod schemas mirroring gateway validation
├── layouts/                         # AdminLayout, CustomerLayout, PublicLayout
├── types/api.types.ts               # response/request shapes, hand-kept in sync with gateway
└── constants/                       # routes.ts, queryParams.ts, storage.ts
```

---

## Prerequisites

- Node.js 20+
- npm 9+
- Gateway running locally (see backend README) — this app has no mock/offline mode

---

## Local Setup

```bash
npm install
cp .env.example .env.local   # fill in values, see below
npm run dev
```

Runs on `http://localhost:5173`.

### Environment variables

```bash
VITE_API_URL=http://localhost:3000          # gateway base URL, no trailing slash
VITE_GOOGLE_CLIENT_ID=                        # required only if VITE_ENABLE_OAUTH=true
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_ENABLE_OAUTH=true                        # toggles Google One Tap in AuthForm.tsx
```

`VITE_API_URL` must match `CORS_ORIGIN` configured on the gateway, and vice versa — CORS is enforced there, not here.

---

## Auth Model

Two completely separate auth domains, deliberately not unified:

|                | Admin                                                  | Customer                                                  |
| -------------- | ------------------------------------------------------ | --------------------------------------------------------- |
| Store          | `stores/adminAuth.store.ts`                            | `stores/customerAuth.store.ts`                            |
| Axios instance | `lib/adminApi.ts`                                      | `lib/customerApi.ts`                                      |
| Token storage  | in-memory (zustand, no persist)                        | in-memory (zustand, no persist)                           |
| Refresh        | httpOnly cookie, rotated via `/api/admin/auth/refresh` | httpOnly cookie, rotated via `/api/customer/auth/refresh` |
| Guard          | `AdminRoute` (+ `RoleRoute` for RBAC)                  | `CustomerRoute`                                           |

Access tokens are **never** written to `localStorage`/`sessionStorage` — they live only in the zustand store, which resets on full page reload. Session survives reload via `main.tsx`'s `restoreSession()`, which fires a `/refresh` call against the httpOnly cookie before the app mounts:

```ts
// main.tsx — runs before createRoot().render()
if (path.startsWith('/admin')) {
  // POST /api/admin/auth/refresh
} else {
  // POST /api/customer/auth/refresh — attempted on every non-/admin route,
  // including public pages, so a returning customer is silently re-authed
}
```

Both `adminApi` and `customerApi` carry the same 401-retry-once pattern: a 401 triggers exactly one `/refresh` call, queues concurrent requests behind it (`pendingQueue`), and replays them with the new token on success. A second 401 after refresh (or a refresh failure) clears the store and hard-redirects to the respective login page — this is a real `window.location.href`, not a router navigation, so it also drops any in-memory query cache.

`422` responses are never toasted globally (`adminApi.ts` short-circuits before the generic error handler) — those are left for the calling form to render as field-level errors via `react-hook-form`.

---

## Role-Based Access (Admin)

Enforced at two independent layers — both must agree, since neither implies the other:

1. **Route level** (`App.tsx` + `RoleRoute`) — blocks navigation outright.
2. **Component level** — action buttons are conditionally rendered so a `reporter`/`maintainer` never sees controls they can't use.

| Role          | Users mgmt | Categories/Products read | Categories/Products write | Delete | Bulk upload |
| ------------- | :--------: | :----------------------: | :-----------------------: | :----: | :---------: |
| `super_admin` |     ✅     |            ✅            |            ✅             |   ✅   |     ✅      |
| `maintainer`  |     —      |            ✅            |            ✅             |   —    |     ✅      |
| `reporter`    |     —      |            ✅            |             —             |   —    |      —      |

This mirrors `requireRole(...)` on the gateway exactly (`inventory.routes.ts`, `admin.routes.ts`) — role gating here is a UX layer, not a security boundary; the gateway is the actual enforcement point. Keep both in sync when either side changes. `ProductsPage.tsx` and `CategoriesPage.tsx` both derive `canWrite`/`canDelete` from `useAdminAuthStore((s) => s.role)` — use that pattern for any new gated action rather than re-deriving role logic inline.

---

## State Management

- **Server state** (products, categories, users, cart, profile) lives entirely in React Query. `queryKeys.ts` is the single source of truth for key shapes — always import from there rather than constructing keys inline, or cache invalidation after mutations will miss.
- **Auth + guest cart** live in zustand, deliberately without the `persist` middleware:
  - Auth tokens: kept out of storage on purpose (XSS surface reduction) — see [Auth Model](#auth-model) above for how sessions actually survive reload.
  - Guest cart (`cart.store.ts`): persisted manually to `localStorage` via its own `persist()` helper (not zustand's), keyed by `GUEST_CART_KEY`. Hydrated once in `main.tsx` before first render (`useCartStore.getState().hydrateFromStorage()`), outside React, so cart contents are available on the very first paint.
- On customer login, `mergePendingCart()` (`customerAuth.store.ts`) walks the guest cart and POSTs each item individually to `/api/customer/cart`, then clears local storage. This is sequential (`for...of` with `await`), not `Promise.all` — intentional, since the cart endpoint upserts by `product_id` and concurrent requests for the same product would race.

---

## Mutation Error Handling Convention

No global `MutationCache` error handler — each mutation hook opts in explicitly:

```ts
// pattern used throughout hooks/inventory, hooks/admin, hooks/customer
onSuccess: () => {
  qc.invalidateQueries({ queryKey: queryKeys.X.all })
  toast.success('...')
},
onError: () => {
  toast.error('...')
},
```

If you add a new mutation, include `onError` — there have been real cases of a mutation succeeding for `super_admin` in testing and then failing silently (no toast, dialog just closes) for a role that gets a 403 from the gateway, because the hook only had `onSuccess`. Axios-level errors (network failure, 5xx) are already toasted generically by the response interceptor for any non-401/422 status, but a hook-level `onError` is still worth adding for mutation-specific messaging and to guarantee something is queryClient-invalidated correctly on failure paths too.

---

## Bulk Upload

`BulkUploadForm.tsx` → `useBulkUpload` → `POST /api/admin/inventory/bulk-upload`, `multipart/form-data`:

```ts
formData.append('excel', excelFile)
imageFiles.forEach((img) => formData.append('images', img))
```

- Excel columns: `name | description | price | stock_quantity | category_slug | thumbnail_filename | list_image_filename`
- `price` is sent to the gateway as a string (`.toFixed(2)`), not a number — the gateway validates it as a decimal string to avoid float precision issues in gRPC. This conversion is done in `ProductForm.tsx` for single-product create/edit; the bulk-upload Excel path relies on the sheet author entering decimal strings directly.
- Image files are matched to rows by **exact filename match** against the `thumbnail_filename`/`list_image_filename` columns, including extension — matching is a plain string lookup server-side, not content-based. A filename listed with no corresponding uploaded file is silently skipped (product still created, that image field stays `null`); there's currently no client-side warning for this mismatch.
- The response summary (`BulkUploadResult`) reports row-level validation/insert failures (`{ total, success, failed, errors[] }`), not missing-image mismatches — those two failure modes look identical in the UI (empty image slot) but only one of them shows up in `errors[]`.

---

## Testing

```bash
npm run test          # vitest, watch mode
npm run test -- --run  # single run (CI)
npm run typecheck      # tsc -b --force
npm run lint           # eslint .
```

Coverage thresholds (`vite.config.ts`, v8 provider): 80% lines/functions/branches/statements, scoped to `src/lib/**`, `src/utils/**`, `src/stores/**` only — components/pages are exercised via Testing Library tests but not gated on coverage numbers.

---

## Build

```bash
npm run build      # tsc -b && vite build
npm run preview     # serve the production build locally
```

`tsc -b` runs before `vite build` and will fail the build on any type error — this is not a lint-only check, it's load-bearing for `build`.

---

## Known Gaps (by design, Phase 1)

- No offline/mock mode — every page assumes a reachable gateway.
- No client-side image resizing/compression before upload (`ProductForm.tsx`, `BulkUploadForm.tsx`) — whatever file size is selected is what gets uploaded.
- `sort`/`order` fields exist in `constants/queryParams.ts` and flow into `ProductListParams` (used only for the React Query cache key) but have no UI control and aren't accepted by the gateway's `ListProductsSchema` — inert, not wired to anything yet.
- No i18n.
