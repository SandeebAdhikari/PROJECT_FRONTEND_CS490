# StyGo Frontend

StyGo is an enterprise salon operating system that pairs a high-converting marketing site with authenticated dashboards for owners, staff, and guests. This repository houses the Next.js 15 + React 19 frontend that speaks to the StyGo API (`NEXT_PUBLIC_API_URL`) and Firebase Authentication to deliver onboarding, appointment orchestration, analytics, and customer experiences in a single codebase.

## Overview
- **App Router slices** power the multi-tenant experience: the public marketing page (`/`), the `/sign-in` and `/sign-up` flows, the owner dashboard under `/salonPortal/salon-dashboard`, the `/customer` booking experience, and salon-specific staff portals under `/salon/[salonSlug]/staff`.
- **TypeScript-first development** keeps shared contracts in `libs/` (auth schemas, analytics types, Firebase helpers) and lightweight hooks such as `useSalonId` for contextual data.
- **Stateful dashboards** lean on native `fetch`, `fetchWithRefresh`, and optimistic React state (modals, forms, and charts) rather than heavy global state libraries, keeping the footprint small while remaining fully typed.

## Features
- **Marketing & demand generation** – Landing modules (`components/Landing`) cover the hero, feature grid, testimonials, enterprise proof, and CTA sections with Tailwind CSS 4 utility classes and responsive imagery from `public/salons/*`.
- **Authentication & onboarding** – Reusable forms (`components/Auth`) built with `react-hook-form` + `zod` handle customer vs owner registration, email/phone sign-ins, OAuth providers (Google, Facebook, Microsoft via `libs/firebase/client`), keep-me-signed-in toggles, and JWT parsing through `jwt-decode`.
- **Security controls** – Middleware (`middleware.ts`) and the admin layout enforce cookie-based auth, `useFirebaseSession` refreshes backend JWT cookies when Firebase tokens rotate, and `Setup2FAModal` promotes two-factor enrollment on first login.
- **Dashboard shell & navigation** – `components/Dashboard/SalonDashboard` renders the persistent navbar, KPI strip, tab navigation, and owner identity while storing the resolved salon in `localStorage` for downstream API calls.
- **Appointment operations** – `components/Dashboard/Appointments` provides calendar ranges, metrics cards, list/detail views, edit modals, and creation wizards that talk to `/api/appointments`, `/api/staff`, `/api/services`, and `/api/users/salon-customers` endpoints with live validation and `react-datepicker` time pickers.
- **Analytics & reporting** – Revenue, utilization, and service distribution views (`components/Dashboard/Analytics`, `Overview`, `ServiceDistChart`, etc.) lean on `recharts` to visualize the payloads defined in `libs/types/analytics` and surface KPIs such as total revenue, avg ticket, goal progress, and channel mix.
- **Staff & customer management** – Owners can add/edit staff with role assignment (`components/Dashboard/Staff`), onboard customers via `AddCustomerModal`, review gallery uploads, and tweak salon settings (`app/salonPortal/salon-dashboard/salon-settings`).
- **Customer experiences** – The `/customer` app router segment composes `components/Customer` to power booking search, curated salon cards, and profile tabs. It reuses shared appointment history widgets and data entry modals.
- **Staff handheld portal** – Dynamic routes such as `/salon/{slug}/staff` expose `StaffLoginCard` and `StaffSignInCodeCard`, enabling team members to claim invites with staff codes + PINs and access upcoming handheld features.
- **Reviews, notifications, history** – Supplemental modules (`components/Reviews`, `Notifications`, `History`) consume the API routes declared in `libs/api/config` to keep guests engaged and ops teams up to date.

## Tech Stack
- Next.js 15 (App Router, React 19, Server/Client components)
- TypeScript 5 + strict ESLint 9 rules via `eslint.config.mjs`
- Tailwind CSS 4 with the `@tailwindcss/postcss` pipeline and custom Inter / Playfair fonts declared in `app/layout.tsx`
- Firebase Web SDK for Auth & OAuth providers
- React Hook Form, Zod, React Datepicker for complex form flows
- Recharts, Lucide React, clsx for visualizations and iconography
- PostCSS + Autoprefixer for the CSS build and Next Image for optimized assets

## Getting Started
### Prerequisites
- Node.js 20 LTS or newer (matching the version Next.js 15 targets)
- npm 10.x (or pnpm/yarn if you adapt the scripts)
- Access to a running StyGo API instance and Firebase project credentials

### Installation
```bash
# Clone and install dependencies
git clone <repo-url>
cd gproject_fontend
npm install

# Configure environment variables (see table below)
touch .env.local  # or create with your editor

# Run the development server
npm run dev
```
The app boots at `http://localhost:3000`. Marketing routes are public, while `/salonPortal/salon-dashboard/*` will redirect to `/sign-in` unless a valid `token` cookie is present.

## Environment Variables
Create an `.env.local` at the repo root with the following keys:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL for the StyGo backend (example: `https://api.stygo.dev`). |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web API key for the auth project. |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain (e.g., `stygo.firebaseapp.com`). |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project id. |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket id. |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app id for the web client. |

Sample `.env.local`:
```ini
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=stygo.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=stygo
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=stygo.appspot.com
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456:web:abcdef
```
> These values are only read on the client, so keep them scoped to public Firebase keys and ensure the backend has CORS enabled for `http://localhost:3000` during development.

## Scripts
| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server with hot reload on `localhost:3000`. |
| `npm run build` | Create an optimized production build in `.next`. |
| `npm run start` | Serve the production build (after `npm run build`). |
| `npm run lint` | Run ESLint 9 with the Next.js shareable config. |

## Project Structure
```
.
├── app/
│   ├── (auth)/               # Sign-in / sign-up flows and auth layout
│   ├── salonPortal/salon-dashboard/ # Owner dashboard routes (overview, analytics, staff, etc.)
│   ├── customer/             # Customer booking + profile experiences
│   ├── salon/[salonSlug]/    # Staff handheld portal entrypoints
│   ├── layout.tsx            # Global fonts + metadata
│   └── page.tsx              # Marketing landing page
├── components/
│   ├── Auth/                 # Shared auth forms, headers, OTP + 2FA modals
│   ├── Dashboard/            # Analytics, appointments, staff, service, overview widgets
│   ├── Landing/              # Marketing hero, features, testimonials, business proof
│   ├── Customer/, Salon/, etc. # Reusable cards, navbars, and modals per surface
├── data/                     # JSON fixtures for mock data & local prototyping
├── hooks/                    # Custom hooks such as `useSalonId`
├── libs/
│   ├── api/                  # API endpoint map + fetch helpers + salon services
│   ├── auth/                 # Zod schemas, Firebase session helpers, AuthProvider
│   └── firebase/             # Firebase client initialization
├── public/                   # Static assets (logos, photography, icons)
├── middleware.ts             # Protect `/admin/salon-dashboard` using JWT expiry checks
├── eslint.config.mjs, tsconfig.json, postcss.config.mjs
└── README.md
```

## Architecture Notes
- **Authentication & security** – Forms submit to the backend defined in `libs/api/config`, `fetchWithRefresh` retries once on 401 to rotate JWTs, and the middleware keeps stale cookies from reaching owner routes. Firebase persistence is set to `browserLocalPersistence` so OAuth tokens survive reloads.
- **API consumption** – All REST endpoints flow through `libs/api` helpers, and modules such as `hooks/useSalonId` centralize deriving the current salon from `/api/auth/me`. This keeps components declarative and avoids scattering base URLs.
- **UI system & styling** – Tailwind CSS 4 is imported once via `app/globals.css`, with tonal tokens expressed as custom class names. Inter and Playfair Display fonts are registered with `next/font`. Icons come from `lucide-react`, and typography/layout align with the enterprise marketing story.
- **Data visualization & scheduling** – Recharts powers the revenue analytics cards, while appointment modals use `react-datepicker` and time pickers to capture slots. Types live in `libs/types` to ensure charts, cards, and modals maintain parity with the API response.

## Contributing & Next Steps
1. Open an issue or discussion before large changes so the API contract stays in sync.
2. Keep additions typed and colocated (components own their styles; shared logic lives in `hooks/` or `libs/`).
3. Run `npm run lint` and, when relevant, hook up the UI to a staging API before submitting a PR.

Potential improvements include wiring automated tests (Playwright/React Testing Library), tightening CI around lint/build, and fleshing out the staff handheld portal once backend endpoints are in place.
