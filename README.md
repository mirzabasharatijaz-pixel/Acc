# AccFlipper

AccFlipper is a Next.js + PostgreSQL marketplace for digital assets with a mandatory 7-day buyer-protection escrow, integrated chat hooks, and admin controls for disputes and delivery. This repository ships a full-stack implementation aligned with the spec: 2% buyer fee + 2% seller fee, auto-release after 168 hours unless a dispute is open, and admin override tools.

## Key behaviors
- **7-day escrow**: `paymentAt` + 7 days = `protectionEndsAt`. Auto-release if no dispute; disputes pause payout until resolved.
- **Fees**: Buyer pays base price + 2%; seller receives base price - 2%; platform revenue = buyer fee + seller fee (4% total).
- **Delivery flow**: Seller uploads access → admin verifies/forwards → buyer tests during protection window.
- **Roles**: buyer, seller, admin. JWT in HTTP-only cookies with bcrypt password storage.
- **Realtime**: Socket.IO endpoint prepared for chat/notifications.

## Quickstart
> npm registry access may be restricted in this environment; install dependencies where networking allows.

```bash
npm install
npx prisma migrate dev
npm run dev
```

Environment variables (create `.env`):
```
DATABASE_URL=postgresql://user:pass@localhost:5432/accflipper
JWT_SECRET=change-me
```

## Testing the flows
- Visit `/listings` to browse listings (fallback demo data appears if the database is unavailable).
- Create an order via API `POST /api/orders` with `{ "listingId": "..." }`.
- Buyer starts escrow `POST /api/orders/:id/pay` (sets `paymentAt` and `protectionEndsAt`).
- Seller submits credentials `POST /api/orders/:id/deliver`.
- Admin forwards credentials `POST /api/orders/:id/forward`.
- Auto-release runs after 7 days or call `POST /api/orders/:id/release`/`POST /api/orders/check-maturing`.
- Open a dispute anytime within the window `POST /api/orders/:id/dispute`.

## Project structure
- `src/app` – App Router pages and API routes
- `src/lib` – Auth helpers, Prisma client, fee calculator, and data fallbacks
- `prisma/schema.prisma` – Database models with escrow/fee fields
- `tailwind.config.ts` & `globals.css` – Styling system

## Assumptions
- Email verification and password reset wiring should integrate with your provider; placeholders are kept minimal.
- Payments are simulated; connect your PSP where `pay` route executes.
- Socket.IO server is initialized via `/api/socket` and should be deployed as a single instance per environment.
