# Spec — Design refresh: drop Vuetify, adopt a custom design system

Status: the app already works end to end (see `docs/tasks/platform-foundation/`). This spec covers a full visual and UX rebuild of the presentation layer only. Business logic (Pinia stores, services, router, types, mock data) does not change.

## Product in one line

Same app — find a sports game on a map in Wrocław, see its details, join with a stub payment, manage your games in a personal cabinet — but with a new, plain, custom-styled look, no Material Design UI kit, and no new auth work.

## Reference mockup

Link: https://stitch.withgoogle.com/preview/1770201254579882951?node-id=e49fc68073d24314b88d3efe2cca863e

Only **one screen** could be reached from this link — a sign-in ("Welcome back") screen. The Stitch preview page has no frame list and no other node IDs in its data, so no other screen (map, game card, game detail, cabinet) could be viewed. Since auth is explicitly out of scope for this pass, this screen is used only as a **style reference** (colors, font, spacing, shapes) — not as a page to copy pixel-for-pixel. Every other screen's design is extrapolated from that same style. See Open Questions.

### Style tokens read from the mockup

- **Font:** Inter (plain sans-serif) for text, "Material Symbols Outlined" for icons — a change from the current Barlow / Barlow Condensed pairing.
- **Background:** white or very light gray page background. No colored surfaces.
- **Buttons:** solid blue primary button (close to our current `#2563EB`), a near-black secondary button, and a white/bordered tertiary button. Corners are rounded (about 10–12px). No drop shadows — shapes are separated by thin (1–1.5px) gray borders, not Material-style elevation.
- **Inputs:** white background, thin gray border, ~10px rounded corners, a small gray icon on the left, label above the field, light gray placeholder text.
- **Links:** blue, no underline.
- **Overall feel:** flat, bordered, lots of white space, no ripple or shadow effects — closer to a plain Tailwind/shadcn-style system than to Material Design.

## Decisions kept from earlier work (not reopened here)

- Six game statuses, each with its own color and icon (open, almost_full, full, in_progress, finished, cancelled). In_progress is merged into the almost_full filter; cancelled is excluded from the filter row but always shown.
- Game card fields (title, address, time · date · duration, seats used/total, price) stay as they are — the user confirmed the card is "informative enough."
- Static Wrocław mock data (`src/services/mock/data.ts`) stays the data source; this is not a data-modeling task.

## Requirements

### R1. Remove Vuetify and Material Design completely
No `vuetify` import, no `v-*` component, and no `@mdi/font` (Material Design Icons) anywhere in the app.

### R2. One small set of design tokens
Define colors, font, spacing, radius, and border styles in one place (not scattered hex values), matching the mockup's flat/bordered look. Every rebuilt component reads from these tokens.

### R3. Rebuild every screen with the new tokens, same behavior
Map page (sidebar, search box, status filter row, game cards), game detail page, personal cabinet (card grid), and the app shell (top bar / bottom nav) all get the new look. Nothing users can already do today stops working.

### R4. Keep the existing test suite green
Every `data-testid` a test looks for stays on the same logical element. Test files that mount a component with the Vuetify plugin drop that import; no test assertion changes.

### R5. Static data, no new auth work
The app keeps using the mock services (`services/mock/*`) with Wrocław data, no `.env` needed. The sign-in page keeps its current mock behavior (email/password, Google/Apple buttons as stubs) but is not rebuilt to match the mockup pixel-for-pixel this pass.

## Acceptance criteria

**R1**
- No file under `src/` imports from `vuetify` or `@mdi/font`.
- No `v-app`, `v-card`, `v-btn`, `v-chip`, `v-text-field`, `v-icon`, or any other Vuetify tag remains in any `.vue` file.
- `package.json` no longer lists `vuetify` or `@mdi/font` as a dependency.

**R2**
- One file (e.g. a Tailwind config or a CSS file with custom properties) is the single source of the color palette, font, radius, and border tokens.
- The primary button, a text input, and a card look visually consistent with the mockup's flat/bordered style (checked by eye against the mockup screenshot).

**R3**
- The map page still shows markers on the map, a sidebar with search box, status filter row, and game cards — restyled, same data and behavior.
- The game detail page still shows title, status, address, time, seats, price, and the Join / payment-stub flow — restyled.
- The cabinet still shows the user's joined games as a card grid with an empty state — restyled.
- No Material ripple effect, elevation shadow, or MDI icon remains on screen anywhere in the app.
- `pnpm dev` renders every page (map, game, cabinet, auth) without console errors.

**R4**
- `pnpm test:run` is green with no test-assertion changes (mount-setup changes, like dropping the `vuetify` plugin from `global.plugins`, are allowed).
- `pnpm typecheck && pnpm lint` are green.

**R5**
- `pnpm dev` with no `.env` file shows the app fully working end to end (map → join → cabinet) against mock data, exactly as it does today.
- The sign-in page still works (mock email/password sign-in, redirect-and-return) but keeps its current simple layout rather than being rebuilt to the mockup.

## Affected modules

**Removed / replaced platform pieces**
- `src/plugins/vuetify.ts` — deleted.
- `src/main.ts` — drop the Vuetify install.
- `package.json` — remove `vuetify`, `@mdi/font`; add the new styling dependency (see Open Questions).

**Rebuilt UI (every `.vue` file that currently uses a Vuetify component)**
- `src/App.vue` — app shell, top bar, bottom nav, theme toggle.
- `src/pages/index.vue` — map page layout, mobile bottom sheet.
- `src/pages/game/index.vue` — game detail page.
- `src/pages/cabinet/index.vue` — cabinet page.
- `src/pages/auth/index.vue` — kept simple, not mockup-matched (R5).
- `src/components/features/Auth/SignInForm/index.vue`.
- `src/components/features/GamesSidebar/index.vue` — search box, status filter row, list.
- `src/components/features/GamesSidebar/GameCard/index.vue`.
- `src/components/features/Cabinet/GamesList/index.vue` — card grid, skeleton loading state.
- `src/components/features/Booking/JoinButton/index.vue`.
- `src/components/features/Booking/PaymentFollowup/index.vue`.
- `src/components/features/Map/MockMap/index.vue` — demo-map badge and zoom buttons.
- `src/components/features/Map/MarkerPin/index.vue` — status icon on the marker.

**Not touched by this spec**
- `src/components/features/Map/GameMarker/index.vue`, `src/components/features/Map/index.vue` — no Vuetify usage today.
- `src/components/features/Map/GoogleMapView/index.vue`, `firebase` package, `src/services/firebase/*`, `src/plugins/firebase.ts` — real backend/map paths stay dormant, unused unless `.env` is set (see Open Questions #5).
- `src/store/*`, `src/services/mock/*`, `src/services/games.ts` / `auth.ts` / `bookings.ts`, `src/types/*`, `src/utils/helpers/*`, `src/router/*` — pure logic, no UI framework dependency.
- `src/utils/ui/gameStatusUi.ts`, `src/components/features/Map/helpers/markerStyle.ts` — status color/icon logic stays; only the container styling around it changes.

**Tests needing a mount-setup update only (no assertion changes)**
- `src/components/features/Auth/SignInForm/index.spec.ts`
- `tests/integration/games/filter-by-status.spec.ts`
- `tests/integration/games/sidebar-follows-bounds.spec.ts`
- `tests/integration/cabinet/my-games.spec.ts`
- `tests/integration/auth/redirect-after-signin.spec.ts`
- `tests/integration/booking/join-game.spec.ts`

## Open questions

1. **Missing mockup screens.** The given Stitch link only shows the sign-in screen. Since auth is out of scope, every other screen (map, sidebar, cards, game detail, cabinet) has no direct mockup to copy — its look is extrapolated from the sign-in screen's tokens (flat, bordered, Inter, blue primary). **Recommended:** proceed this way. Alternative: share Stitch links/node-ids for the other screens if they exist, so the redesign can match them directly instead of being extrapolated.

2. **Styling approach.** Vuetify needs a replacement. **Recommended:** Tailwind CSS plus a small set of hand-built Vue components (Button, Input, Card, Chip, BottomSheet) — matches the mockup's plain look with the least added weight, and avoids swapping one opinionated component kit for another. Alternative: Tailwind + Reka UI (headless Vue primitives, used by shadcn-vue) for the interactive pieces (bottom sheet, dropdowns) — more accessible keyboard/focus handling out of the box, a bit more setup.

3. **Dark theme.** Added in the previous pass; the mockup has no dark variant, and the ask is to strip things down. **Recommended:** drop the dark/light toggle for this pass (App.vue and the theme toggle button go away) — it can come back later, styled to the new tokens, if wanted. Alternative: keep it, rebuilt with plain CSS custom properties instead of Vuetify's theme system.

4. **Icon set.** The mockup's own network traffic shows it uses "Material Symbols Outlined" (Google's icon font), not MDI (`@mdi/font`, our current set). **Recommended:** switch to Material Symbols Outlined to match the mockup exactly — same integration pattern (one Google Fonts link), low cost. Alternative: keep MDI — already wired, visually a similar outline style, zero migration.

5. **Real backend code.** `services/firebase/*`, `GoogleMapView.vue`, the `firebase` and `vue3-google-map` packages are unused today unless `.env` is set. **Recommended:** keep them as they are (dormant) — they are not part of "Material UI," and removing them would cut a separate, already-delivered piece of scope (R7/R8 of platform-foundation) that this spec was not asked to undo. Alternative: remove them now, since the ask is "static data everywhere."
