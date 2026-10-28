<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Wanderlast

Full-stack Next.js travel app with authentication, destinations, and bookings. Not just a marketing site. `README.md` is stock create-next-app text; the real app is under `src/`. Package name is `wanderlust` but product brand is **Wanderlast**.

## Commands

- `npm run dev` — Webpack dev server on port 3000 (`next dev --webpack`).
- `npm run build` — Webpack production build (`next build --webpack`); also runs TypeScript.
- `npm run start` — Production server (`next start`).
- `npm run lint` — ESLint 9 flat config.
- `npx tsc --noEmit` — standalone typecheck (no `typecheck` script).
- Use npm; `package-lock.json` is committed. No test runner configured.

Both scripts pass `--webpack` on purpose. This Windows machine has Smart App Control enabled (`VerifiedAndReputablePolicyState = 1`), which blocks `node_modules/@next/swc-win32-x64-msvc/next-swc.win32-x64-msvc.node`. Next.js falls back to WASM SWC, and Turbopack refuses to start without native bindings. Don't remove the flag.

Because the scripts never use Turbopack, Tailwind v4 is compiled through PostCSS (`postcss.config.mjs` + `@tailwindcss/postcss`), not the `@tailwindcss/turbopack` loader. There is no `turbopack.rules` entry in `next.config.ts`; don't re-add the loader without also removing the PostCSS plugin, or Tailwind compiles twice.

`npm run lint` currently fails on `src/components/ui/carousel.tsx` with `react-hooks/set-state-in-effect` (vendored shadcn code plus React Compiler). Don't treat that pre-existing error as a regression; lint touched files directly.

## Architecture

- Next.js 16.4 App Router in `src/app`, React 19, Tailwind CSS v4, strict TypeScript, `@/*` → `src/*`.
- `next.config.ts` enables `cacheComponents`, `partialPrefetching`, `reactCompiler`. Read `node_modules/next/dist/docs/` before adding data fetching or caching; older Next.js fetch-caching defaults do not apply. Use `"use cache"` / `cacheLife` as documented.
- `src/app/layout.tsx` is the only root layout: loads Josefin Sans via `next/font`, renders `Navbar` and `Footer` globally.
- Page routes: `/` (home), `/signIn`, `/signUp`, `/profile`, `/myBookings`.
- Section components live in `src/components` (`hero.tsx`, `navbar.tsx`, `footer.tsx`, `why-choose-us.tsx`, `testimonials.tsx`, `book-trip.tsx`); shadcn primitives in `src/components/ui`; feature components in `src/components/destinations/` and `src/components/bookings/`; auth components in `src/components/auth/`.
- `LayoutProps<"/">` and `PageProps<...>` are Next 16 generated global types; don't import them.
- **Auth**: better-auth with MongoDB adapter (`src/lib/auth.ts`). Requires `MONGODB_URI`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` env vars.
- **Data**: MongoDB collections for users, destinations, bookings. See `src/lib/destinations.ts`.

## UI conventions

- shadcn configured for `base-nova` with Base UI (`@base-ui/react`), not Radix. Add primitives with `npx shadcn@latest add <name>` rather than hand-rolling Radix equivalents.
- Class merging uses the `cn` package (shadcn's clsx + tailwind-merge replacement), imported as `import { cn } from "cn"` in generated files; `@/lib/utils` only re-exports it. Don't add clsx or tailwind-merge.
- Tailwind v4 is CSS-first: no `tailwind.config.*`. Theme tokens in `src/app/globals.css` under `@theme inline`, `:root`, and `.dark`.
- Brand teal is hardcoded as `#10a5c4` (hover `#0e8ea9`); the shadcn `primary` token is neutral/black, so `bg-primary` is **not** the brand color.
- Product name is **Wanderlast** (navbar, logo), even though `metadata.title` says "Wanderlust".
- Images in `public/assets`; hero banner `/assets/Banner.png`, navbar logo `/assets/Wanderlast.png` (white variant: `Wanderlast-1.png`), feature icons: `ShieldCheck.png`, `MapTrifold.png`, `Headset.png`. Destination images in `public/assets/destinations/`.
