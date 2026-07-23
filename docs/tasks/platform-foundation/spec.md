# Spec — Platform foundation (MVP)

Status: greenfield. There is only a mockup idea, no code yet. This spec sets the MVP scope and the base stack. It is the base that later feature specs build on.

## Product in one line

A platform to find a game on a map. The user opens a map, sees games as points, joins a game, pays, and manages their games in a personal cabinet. The app must work well on all screen sizes.

## Decided stack

All stack questions are resolved with the user (2026-07-13):

| Area | Choice | Notes |
|---|---|---|
| App shell | **Vite + Vue 3 SPA** | No SSR/SEO need for MVP. TypeScript, pnpm. |
| UI library | **Vuetify v4** | Material Design 3, 80+ components, built-in responsive grid and breakpoints. |
| Map | **vue3-google-map** | Vue 3 wrapper over Google Maps JS API. `CustomMarker` for status-colored points, `MarkerCluster` for clustering, `bounds_changed` for the sidebar sync. Needs an API key with billing (in `.env`). |
| Auth | **Firebase Auth** | Google sign-in + email. No own auth backend. |
| Data | **Firebase Firestore** | Games and registrations live in Firestore. Realtime updates of game status come for free. |
| Payment | **Stub for MVP** | The payment follow-up screen and statuses are real; the provider call is mocked. A real provider comes later. |
| State | **Pinia** | Per `.claude/rules/`. Firestore calls stay in `services/`, not in components. |

Alternatives that were considered and rejected for now: Nuxt 3 (only needed for SEO), PrimeVue (stronger tables but not Material by default), Quasar (full framework, too heavy for this start), Supabase (would split the stack; Firebase covers auth + data in one).

## Game model (MVP)

Game statuses (full lifecycle, decided):

- `open` — has free seats, can join
- `almost_full` — few seats left, can join
- `full` — no seats, cannot join
- `in_progress` — the game is being played now
- `finished` — the game is over
- `cancelled` — the game was cancelled

Each status has its own marker look on the map (color, and icon where needed). `almost_full` may be derived from seat counts; store it as a status value in the UI model either way so the marker and list render from one field.

## Requirements

### R1. Responsive on all devices
The app works on phone, tablet, and desktop. Layout changes by screen size (mobile-first). Vuetify breakpoints drive the layout.

### R2. Map with game points
A Google Map is the main view. Each game from Firestore is a marker. The marker look reflects the game status (six statuses above). Close markers cluster; zooming in splits clusters.

### R3. Sidebar list synced to the map
A sidebar shows the games inside the current map bounds. When the user pans or zooms, the list updates to match the visible area. On mobile the sidebar becomes a bottom sheet / drawer.

### R4. Auth (Firebase)
The user can sign in with Google or email. Join and cabinet need an authorized user. A signed-out user who tries a protected action is sent to sign-in and returns back after.

### R5. Join a game + payment follow-up
An authorized user registers for a game with free seats (`open` / `almost_full`). After registration the payment follow-up screen opens. For MVP the payment call is a stub, but the flow and the registration state are real: the user's registration is stored in Firestore and seat counts update.

### R6. Personal cabinet
An authorized user has a page with all games they joined (upcoming and past). Empty state when there are none.

### R7. Base stack set up
The repo has a working app with Vuetify, vue3-google-map, Firebase (auth + Firestore), and Pinia wired, so feature work can start fast.

### R8. Map start position
On load the app asks for geolocation and centers the map on the user. If the user denies or it fails, the map centers on **Wrocław** with a city-level zoom.

## Acceptance criteria

- **R1:** On a mobile width the sidebar collapses (drawer/bottom sheet) and the map stays usable; on desktop the sidebar and map are side by side. No horizontal body scroll at any common width.
- **R2:** Markers render from Firestore data. Each of the six statuses has a distinct marker look. Many close points cluster; zoom-in splits the cluster.
- **R3:** After a pan/zoom the sidebar shows only games inside the current bounds, without manual refresh.
- **R4:** Google and email sign-in both work. Opening the cabinet signed-out redirects to sign-in; after sign-in the user lands back on the cabinet. Join as a guest triggers the same redirect-and-return.
- **R5:** Joining an `open` game creates a registration in Firestore, updates the seat count, and opens the payment follow-up (stub). A `full`, `in_progress`, `finished`, or `cancelled` game cannot be joined (the action is not available).
- **R6:** The cabinet lists the signed-in user's games; a fresh user sees an empty state.
- **R7:** `pnpm dev` starts the app; the map renders with at least one marker; Vuetify components render with Material styles; `pnpm typecheck` and `pnpm lint` are green.
- **R8:** With geolocation allowed, the map centers on the user's position. With geolocation denied, the map centers on Wrocław.

## Modules (to be created)

- `src/main.ts`, `src/App.vue` — app entry; Vuetify, Pinia, router install.
- `src/plugins/vuetify.ts` — Vuetify theme + breakpoints.
- `src/plugins/firebase.ts` — Firebase app init (config from `.env`).
- `src/components/features/Map/` — map wrapper, status markers, clustering, bounds tracking.
- `src/components/features/GamesSidebar/` — bounds-synced list; drawer/bottom sheet on mobile.
- `src/components/features/Booking/` — join flow + payment follow-up (stub).
- `src/store/games/` — games state, current bounds, visible-games getter.
- `src/store/auth/` — Firebase session state, redirect-and-return logic.
- `src/store/booking/` — registration state.
- `src/pages/` — map (home), game, cabinet, auth.
- `src/services/firebase/` — Firestore/auth calls (games, registrations); components never call Firebase directly.
- `src/router/` — routes + auth guard.
- `.env` — Google Maps API key, Firebase config (never read by tools; see rules).

## Out of scope (MVP)

- Real payment provider integration (stub only).
- Game creation/admin UI (games appear in Firestore by other means for now).
- Notifications, chat, reviews.
- SEO / SSR.

## Open questions

None — all seven original questions were answered on 2026-07-13 (see "Decided stack", "Game model", R8).
