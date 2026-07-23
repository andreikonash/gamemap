# Plan — Platform foundation (MVP)

Source: `docs/tasks/platform-foundation/spec.md`. Greenfield — every step creates new files.
Each step is one small unit of work. Mark `- [x]` when done.

## Steps

### Phase 1 — Project skeleton

- [x] **1. Scaffold the app.**
  Create a Vite + Vue 3 + TypeScript project with pnpm.
  Files: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.ts`, `src/App.vue`, `.gitignore`, `.env.example`.
  Scripts: `dev`, `build`, `lint`, `lint:fix`, `lint:file`, `typecheck`, `test`, `test:run`, `test:unit`, `test:integration`.
  Aliases: `@/` → `src/`, `@tests` → `tests/`.
  ESLint flat config + Vitest setup (`tests/setup.ts`, unit + integration projects).
  Verify: `pnpm dev` serves a page; `pnpm typecheck && pnpm lint` green.

- [x] **2. Add Vuetify v4.**
  Files: `src/plugins/vuetify.ts` (theme, defaults), install in `src/main.ts`.
  Verify: a `v-btn` on the start page renders with Material styles.

- [x] **3. Add Firebase init.**
  Files: `src/plugins/firebase.ts` (app init from `.env` vars), `.env.example` keys: Firebase config + `VITE_GOOGLE_MAPS_API_KEY`.
  Verify: app boots with no Firebase errors in console.

- [x] **4. Router + page skeletons + auth guard stub.**
  Files: `src/router/index.ts`, `src/router/guards/auth.ts`, `src/pages/index.vue` (map page), `src/pages/game/index.vue`, `src/pages/cabinet/index.vue`, `src/pages/auth/index.vue`.
  Routes: `/` (map), `/game/:id`, `/cabinet` (protected), `/auth`.
  The guard reads the auth store (built in step 5) and keeps a `redirect` target.
  Verify: navigation between empty pages works.

### Phase 2 — Auth

- [x] **5. Auth service + store.**
  Files: `src/services/firebase/auth.ts` (Google sign-in, email sign-in/up, sign-out, session listener), `src/store/auth/index.ts` (`createInitialState`, session state, `isLoggedIn` getter, redirect-and-return logic).
  Tests: `src/store/auth/index.spec.ts`.
  Verify: unit tests green.

- [x] **6. Sign-in page.**
  Files: `src/pages/auth/index.vue`, `src/components/features/Auth/SignInForm/index.vue`.
  Google button + email form (Vuetify). On success, go to the saved `redirect` target or `/`.
  Tests: `src/components/features/Auth/SignInForm/index.spec.ts` (emits/calls on submit),
  `tests/integration/auth/redirect-after-signin.spec.ts` (guard redirects out and back).
  Verify: tests green; manual sign-in works against the real Firebase project.

### Phase 3 — Games data + map

- [x] **7. Game types + games service.**
  Files: `src/types/game.ts` (`IGame`, `GAME_STATUS` const object — six statuses, no enum), `src/services/firebase/games.ts` (list games, subscribe to games, get one game).
  Tests: `src/services/firebase/games.ts` mapping test with mocked Firestore SDK.
  Verify: unit tests green.

- [x] **8. Games store.**
  Files: `src/store/games/index.ts` — games list, `mapBounds` state, `visibleGames` getter (games inside bounds), `setBounds` action.
  Tests: `src/store/games/index.spec.ts` (`visibleGames` filters by bounds; edge: no bounds yet → empty or all, pick one and assert it).
  Verify: unit tests green.

- [x] **9. Map feature.**
  Files: `src/components/features/Map/index.vue` (GoogleMap from `vue3-google-map`),
  `src/components/features/Map/GameMarker/index.vue` (CustomMarker; look per status),
  `src/components/features/Map/helpers/markerStyle.ts` (status → color/icon),
  `src/components/features/Map/helpers/startPosition.ts` (geolocation → fallback Wrocław `{ lat: 51.1079, lng: 17.0385 }`).
  Wire `MarkerCluster`, `bounds_changed` → debounced `games.setBounds`.
  Tests: `markerStyle.spec.ts` (each status maps to a distinct style), `startPosition.spec.ts` (geo ok → user coords; geo denied → Wrocław).
  Verify: unit tests green; markers + clusters visible in the running app.

- [x] **10. Games sidebar.**
  Files: `src/components/features/GamesSidebar/index.vue`, `src/components/features/GamesSidebar/GameCard/index.vue`.
  Desktop: side panel next to the map. Mobile (Vuetify breakpoint): bottom sheet/drawer.
  Reads `visibleGames` from the store. Click → `/game/:id`.
  Tests: `tests/integration/games/sidebar-follows-bounds.spec.ts` (set bounds in store → sidebar shows only games inside).
  Verify: tests green; pan/zoom updates the list in the app.

### Phase 4 — Booking + cabinet

- [x] **11. Booking service + store.**
  Files: `src/services/firebase/bookings.ts` (create registration, list my registrations, update seat count — transaction), `src/store/booking/index.ts` (join action, `canJoin` getter: only `open`/`almost_full`).
  Tests: `src/store/booking/index.spec.ts` (`canJoin` per status — one test per joinable/non-joinable group; join calls service with right args; error branch).
  Verify: unit tests green.

- [x] **12. Game page + join flow + payment stub.**
  Files: `src/pages/game/index.vue`, `src/components/features/Booking/JoinButton/index.vue`, `src/components/features/Booking/PaymentFollowup/index.vue` (stub screen: summary + fake "Pay" that marks the registration `paid`).
  Guest click on Join → auth redirect-and-return (reuses step 5 logic).
  Tests: `tests/integration/booking/join-game.spec.ts` (authed user joins an open game → registration stored, seats down, follow-up shown; full game → no join action).
  Verify: tests green; whole flow works in the app.

- [x] **13. Personal cabinet.**
  Files: `src/pages/cabinet/index.vue`, `src/components/features/Cabinet/GamesList/index.vue`.
  Lists my registrations (upcoming/past), empty state for none.
  Tests: `tests/integration/cabinet/my-games.spec.ts` (user with games sees them; fresh user sees the empty state).
  Verify: tests green.

### Phase 5 — Final gate

- [ ] **14. Responsive pass + full gate.**
  Check mobile/tablet/desktop layouts (drawer vs side-by-side, no horizontal body scroll).
  Run `pnpm typecheck && pnpm lint && pnpm test:run` — all green.
  Verify acceptance criteria R1–R8 one by one against the running app.

## Test map

| Requirement / criterion | Test | Level |
|---|---|---|
| R1 responsive layout | manual check in step 14 (layout is Vuetify breakpoints — framework wiring, not unit-testable honestly) | manual |
| R2 marker look per status | `Map/helpers/markerStyle.spec.ts` | unit |
| R2 markers from data / clustering | cluster internals are library code — verify visually in step 9 | manual |
| R3 sidebar follows bounds | `tests/integration/games/sidebar-follows-bounds.spec.ts` | integration |
| R3 `visibleGames` filter logic | `src/store/games/index.spec.ts` | unit |
| R4 session state + redirect logic | `src/store/auth/index.spec.ts` | unit |
| R4 guard redirects out and back | `tests/integration/auth/redirect-after-signin.spec.ts` | integration |
| R5 join allowed only for joinable statuses | `src/store/booking/index.spec.ts` (`canJoin`) | unit |
| R5 join flow end to end (registration, seats, follow-up) | `tests/integration/booking/join-game.spec.ts` | integration |
| R6 cabinet lists my games + empty state | `tests/integration/cabinet/my-games.spec.ts` | integration |
| R7 stack boots, gates green | step 1/14 verify commands | manual |
| R8 start position (geo / Wrocław fallback) | `Map/helpers/startPosition.spec.ts` | unit |

Firestore SDK is mocked at the `services/firebase` boundary in all tests (per `.claude/rules/testing.md` — mock only the network boundary).

## Suggested order / parallelism

Steps 1–4 are sequential (each builds on the previous). After step 5: auth UI (6) and games data (7–8) can go in parallel. Map (9) needs 8. Sidebar (10) needs 8–9. Booking (11–12) needs 5 and 7. Cabinet (13) needs 11.
