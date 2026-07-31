# Velocity Motors — Admin Dashboard

A React + Tailwind admin dashboard for the Velocity Motors bike shop API.
Frontend only — it talks to your existing Express/MongoDB backend over the
endpoints already defined in `bikes.routes.js`, `category.routes.js`, and
`order.routes.js`.

## Setup

```bash
npm install
cp .env.example .env   # already pre-filled with your API URL — just set the admin login
npm run dev
```

Open http://localhost:5173

## Configuration (`.env`)

```dotenv
VITE_API_URL=https://bike-shop-upta.onrender.com/api/v1

VITE_ADMIN_EMAIL=admin@velocitymotors.bd
VITE_ADMIN_PASSWORD=change-this-password
```

Login is **static and client-side only** — there's no `/auth` endpoint on the
backend. The email/password typed on the login screen are compared directly
against `VITE_ADMIN_EMAIL` / `VITE_ADMIN_PASSWORD`, and a session flag is
kept in `localStorage`.

⚠️ Because Vite bakes `.env` values into the built JS bundle, anyone who can
view the deployed site's source can read the admin password. This is fine
for a single-admin internal tool kept off public search/behind a private
URL, but it is **not real access control** — don't reuse this pattern for
anything that needs to keep out a determined visitor.

## What's included

- **Dashboard** — active bike/category counts, pending orders, recent orders
- **Bikes** — search, paginated table, create/edit modal (all fields from
  the backend's Zod schema: pricing, EMI, specs, all boolean flags),
  thumbnail + gallery image upload, soft delete
- **Categories** — grid view, create/edit modal, image upload, delete
  (blocked by the API with a clear message if bikes are still linked)
- **Orders** — search + status/payment filters, detail modal showing items
  and totals, order-status transitions restricted to exactly what the
  backend's `ALLOWED_TRANSITIONS` state machine permits, payment-status
  update, cancel, and hard delete

## Known API limitations reflected in the UI

- **Gallery images are add-only.** `PUT /bikes/:id` only appends new files
  to the existing `images` array — there's no endpoint to remove a single
  gallery image. The gallery picker in the bike form reflects this: existing
  images are shown read-only, new ones get added on top.
- **No "get bike by id" endpoint.** Editing a bike reuses the row data
  already loaded in the list table rather than fetching it again.
- **Category delete can fail (409).** If any bike still references a
  category, the API rejects the delete — the dialog surfaces that message
  directly.

## Stack

React 18, React Router 6, TanStack Query 5, Tailwind CSS 3, Axios,
react-hot-toast, lucide-react icons. Built with Vite.

## Build for production

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```
