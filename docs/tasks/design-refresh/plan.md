# Plan — Design refresh: drop Vuetify, adopt a custom design system

Source: `docs/tasks/design-refresh/spec.md`. All five open questions there are taken at their **recommended** option (no reply was needed to proceed):
1. Extrapolate the mockup's style to every screen (only the sign-in screen was reachable).
2. Tailwind CSS + small hand-built Vue components (no second component kit).
3. Drop the dark/light theme toggle for this pass.
4. Switch icons to Material Symbols Outlined (matches the mockup).
5. Leave `services/firebase/*`, `GoogleMapView.vue`, the `firebase`/`vue3-google-map` packages alone (dormant, untouched).

Each step is one small unit of work. Mark `- [x]` when done.

## Design tokens (locked in for step 1, so later steps don't re-decide them)

| Token | Value | Used for |
|---|---|---|
| `--color-bg` / `--color-surface` | `#FFFFFF` | Page and card background (flat — no separate elevated surface) |
| `--color-border` | `#E2E8F0` | 1.5px borders on cards, inputs, dividers |
| `--color-text` | `#0F172A` | Body text, headings |
| `--color-text-muted` | `#64748B` | Secondary text, placeholders |
| `--color-primary` / `--color-primary-hover` | `#2563EB` / `#1D4ED8` | Primary button, links, active states |
| `--color-secondary` | `#0F172A` | Secondary (dark) button |
| `--font-sans` | `Inter` | All text |
| `--radius-sm` / `--radius-md` / `--radius-lg` | `8px` / `12px` / `16px` | Inputs / buttons+cards / bottom sheet |

Game status colors (open/almost_full/full/in_progress/finished/cancelled) are untouched — they already live in `markerStyle.ts` as their own hex values, independent of the Vuetify theme.

Icon name mapping (MDI → Material Symbols Outlined), used across later steps:
`account_circle`, `logout`, `login`, `map`, `search`, `cancel`, `check_circle`, `error`, `lock`, `play_circle`, `flag`, `schedule`, `group`, `format_list_bulleted`, `progress_activity` (spinning, for loading buttons). The Google/Apple sign-in buttons drop the brand-logo icon (Material Symbols has no logo glyphs, same limitation the mockup itself has) and keep the label text only.

## Steps

### Phase 1 — Foundation

- [x] **1. Remove Vuetify, install Tailwind.**
  Files: `package.json` (remove `vuetify`, `@mdi/font`; add `tailwindcss`, `@tailwindcss/vite`), `vite.config.ts` (add the Tailwind Vite plugin; drop the `test.server.deps.inline: ['vuetify']` line), `src/plugins/vuetify.ts` (delete), `src/main.ts` (drop the Vuetify import/`.use()`, add the new global CSS import).
  Verify: `pnpm install` succeeds; `pnpm dev` boots to a blank/unstyled app with no Vuetify-related console errors.

- [x] **2. Design tokens + global CSS.**
  Files: `src/styles/main.css` (new — `@import "tailwindcss";` plus an `@theme` block with the tokens table above), `index.html` (replace the Barlow/Barlow Condensed Google Fonts link with Inter + Material Symbols Outlined).
  Verify: a plain `<button class="bg-primary">` renders blue in the browser.

- [x] **3. Shared UI primitives.**
  Files (new): `src/components/ui/Icon/index.vue` (wraps a Material Symbols `<span>`, props `name`, `size`, `color`), `src/components/ui/Button/index.vue` (props `variant`: `primary | secondary | outline | ghost`, `loading`, `disabled`; renders the spinning `progress_activity` icon when loading), `src/components/ui/IconButton/index.vue` (round/square icon-only button, for the app bar and map zoom controls), `src/components/ui/Input/index.vue` (label above, left icon slot, error slot), `src/components/ui/Card/index.vue` (bordered container, optional left accent-color stripe via a prop, for status-colored game cards), `src/components/ui/Chip/index.vue` (small pill, `color` + `icon` props, `selected` boolean for filled-vs-outlined), `src/components/ui/Skeleton/index.vue` (pulsing rounded rectangle, `width`/`height` props), `src/components/ui/index.ts` (barrel export).
  No test files yet — these are pure presentational primitives with no branching logic (per `.claude/rules/testing.md`, "purely presentational components" are covered when part of a flow, not standalone).
  Verify: none yet (used starting Phase 3).

### Phase 2 — App shell

- [x] **4. Rebuild `App.vue`.**
  Files: `src/App.vue`.
  Plain top bar (logo/title left, cabinet + sign-out icon buttons right, using the new `Icon`/`IconButton`), bottom nav on mobile (Map / My games) as plain buttons instead of `v-bottom-navigation`. No theme toggle (dropped per open question #3). Keep `data-testid="app-bar-cabinet"`, `app-bar-signout`, `app-bar-signin`, `bottom-nav-map`, `bottom-nav-cabinet`, `bottom-nav-signin` exactly as they are today.
  Verify: `pnpm dev` — top bar and bottom nav (on a narrow viewport) render and navigate.

### Phase 3 — Map page

- [x] **5. `MockMap` and `MarkerPin` without Vuetify.**
  Files: `src/components/features/Map/MockMap/index.vue` (swap the `v-chip` demo badge and `v-btn` zoom buttons for `Chip`/`IconButton`), `src/components/features/Map/MarkerPin/index.vue` (swap `v-icon` for `Icon`).
  Verify: `markerStyle.spec.ts` still green (untouched logic, only the template changes).

- [x] **6. `GameCard` without Vuetify.**
  Files: `src/components/features/GamesSidebar/GameCard/index.vue`.
  Rebuild with `Card` (status-color left stripe) + `Icon` for the clock/seats rows. Keep the hover-lift transition, the `aria-label`, and every `data-testid` (`game-card`, `data-game-id`) unchanged.
  Verify: manual check in the running app — card shows the same fields (title, address, time · date · duration, seats, price).

- [x] **7. `GamesSidebar` without Vuetify.**
  Files: `src/components/features/GamesSidebar/index.vue`.
  Search box → `Input`. Status filter row → a plain flex row of `Chip`s sharing one bordered, rounded-pill container with a 1px divider between them (built directly here, not a new shared primitive — it is only used in this one place). Keep the `TransitionGroup` stagger behavior and every `data-testid` (`games-search`, `status-filters`, `status-filter-<key>`, `games-sidebar-empty`, `games-sidebar-filtered-empty`) unchanged.
  Verify: `tests/integration/games/sidebar-follows-bounds.spec.ts` and `tests/integration/games/filter-by-status.spec.ts` green after the mount-setup update in step 11.

- [x] **8. `pages/index.vue` (map page) without Vuetify.**
  Files: `src/pages/index.vue`.
  Replace the `v-btn` sheet-toggle and `v-bottom-sheet` with a plain fixed-position bottom panel (backdrop + slide-up transition, closes on backdrop click or Escape) built inline in this file — it is used only here, so it does not need to be a shared primitive. Keep `data-testid="open-games-sheet"` and the mobile-height calc that already accounts for the bottom nav.
  Verify: manual check — mobile bottom sheet opens/closes, no layout overlap with the bottom nav.

### Phase 4 — Game detail + booking

- [x] **9. Game detail page without Vuetify.**
  Files: `src/pages/game/index.vue`.
  Skeleton loading state uses the new `Skeleton` primitive (a few stacked rectangles matching the page's shape) instead of `v-skeleton-loader`. Status chip uses `Chip`. Keep `data-testid="game-loading"`, `game-not-found`, `game-status`.
  Verify: manual check — loading skeleton, then title/status/address/time/seats/price render.

- [x] **10. `JoinButton` and `PaymentFollowup` without Vuetify.**
  Files: `src/components/features/Booking/JoinButton/index.vue`, `src/components/features/Booking/PaymentFollowup/index.vue`.
  `JoinButton` uses `Button` (`variant="primary"`, `loading`, `disabled` — keeping the double-click fix from before). `PaymentFollowup` uses `Card` + `Button`. Keep `data-testid` (`join-button`, `payment-followup`, `payment-pay`, `payment-success`) unchanged.
  Verify: `tests/integration/booking/join-game.spec.ts` green after step 11.

### Phase 5 — Cabinet

- [x] **11. Cabinet page + `GamesList` without Vuetify.**
  Files: `src/pages/cabinet/index.vue`, `src/components/features/Cabinet/GamesList/index.vue`.
  Card grid stays a plain CSS grid of `Card`s; loading state uses `Skeleton`. Keep `data-testid` (`cabinet-loading`, `cabinet-empty`, `cabinet-game`, `cabinet-game-status`) unchanged.
  Verify: `tests/integration/cabinet/my-games.spec.ts` green after step 11 (test file), manual check for the bento grid + hover-scale.

### Phase 6 — Auth (kept simple, per spec R5)

- [x] **12. Auth page + `SignInForm` — light touch only.**
  Files: `src/pages/auth/index.vue`, `src/components/features/Auth/SignInForm/index.vue`.
  Swap `v-card`/`v-btn`/`v-text-field`/`v-alert` for the new `Card`/`Button`/`Input` primitives so no Vuetify tag remains (required by R1), but do not attempt to match the mockup's polished sign-in layout pixel-for-pixel (R5 — out of scope). Keep every `data-testid` (`signin-google`, `signin-email`, `signin-password`, `signin-error`, `signin-submit`, `signin-toggle`) unchanged.
  Verify: `src/components/features/Auth/SignInForm/index.spec.ts` and `tests/integration/auth/redirect-after-signin.spec.ts` green after step 13.

### Phase 7 — Tests, cleanup, final gate

- [x] **13. Update test mount setup (no assertion changes).**
  Files: `src/components/features/Auth/SignInForm/index.spec.ts`, `tests/integration/games/filter-by-status.spec.ts`, `tests/integration/games/sidebar-follows-bounds.spec.ts`, `tests/integration/cabinet/my-games.spec.ts`, `tests/integration/auth/redirect-after-signin.spec.ts`, `tests/integration/booking/join-game.spec.ts`.
  Drop the `import { vuetify } from '@/plugins/vuetify'` line and remove `vuetify` from each `global.plugins` array. Do not touch any `expect(...)`.
  Verify: `pnpm test:run` green.

- [x] **14. Full gate + visual pass.**
  Run `pnpm typecheck && pnpm lint && pnpm test:run` — all green.
  `grep -rn "vuetify\|v-app\|v-card\|v-btn\|v-chip\|v-icon\|v-text-field\|mdi-" src` returns nothing (R1 acceptance criterion).
  Manually check every page (map, game, cabinet, auth) at desktop and mobile widths in the running app: no Material ripple/elevation/MDI icon remains, all existing flows (search, filter, join, pay, cabinet) still work, matches the acceptance criteria in spec.md R1–R5.

## Test map

| Requirement / acceptance criterion | Test | Level |
|---|---|---|
| R1 no Vuetify/MDI import or tag anywhere | `grep` check in step 14 (static check, not unit-testable) | manual |
| R2 one token source, consistent look | manual visual check in step 14 | manual |
| R3 map page keeps working (search, filter, cards) | `tests/integration/games/sidebar-follows-bounds.spec.ts`, `tests/integration/games/filter-by-status.spec.ts` | integration |
| R3 game detail + join/payment keep working | `tests/integration/booking/join-game.spec.ts` | integration |
| R3 cabinet keeps working | `tests/integration/cabinet/my-games.spec.ts` | integration |
| R3 sign-in + redirect-and-return keeps working | `src/components/features/Auth/SignInForm/index.spec.ts`, `tests/integration/auth/redirect-after-signin.spec.ts` | unit + integration |
| R3 marker/status color-icon logic unchanged | `src/components/features/Map/helpers/markerStyle.spec.ts` | unit |
| R3 duration formatting unchanged | `src/utils/helpers/formatDuration.spec.ts` | unit |
| R4 full test suite green, no assertion changes | step 13 + step 14 (`pnpm test:run`) | — |
| R4 typecheck/lint green | step 14 (`pnpm typecheck && pnpm lint`) | — |
| R5 app runs on mock data with no `.env` | manual check in step 14 (`pnpm dev`, no `.env` present) | manual |

## Suggested order / parallelism

Steps 1–3 are sequential (foundation must exist before anything else compiles cleanly). After step 3: step 4 (app shell), Phase 3 (map), Phase 4 (game/booking), Phase 5 (cabinet), and Phase 6 (auth) can each proceed independently since they touch disjoint files — but do them in the listed order to keep the working tree buildable between steps (an in-progress mixed Vuetify/Tailwind state is expected only within a single step, not across a commit). Step 13 (test updates) can happen alongside whichever phase touches each test's component, or all at once at the end. Step 14 is always last.
