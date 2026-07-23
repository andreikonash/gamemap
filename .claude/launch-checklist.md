# Launch readiness checklist

Single priority-ordered backlog (1 = hosting, 32/∞ = native mobile) between the current
GameMap build and a real production launch. Ordered by a blend of importance and
complexity. Last verified against the codebase: 2026-07-23 (items 7, 8, 13 (redefined),
14 (partial) implemented and verified live against the real Firebase project this
session). 2026-07-24: security review + hosting/backend recommendation added to items
1, 3, 9, 14 below (analysis only, no code changed yet).

Treat this as the living roadmap. Re-verify an item against the current code/Firebase
state before assuming it's still accurate — this list decays as work lands. Update or
renumber items here as they complete; don't silently re-derive from scratch.

## Ordered list

1. **Hosting / deploy target.** No Firebase Hosting / Vercel / Netlify configured —
   `firebase.json` only covers firestore+auth. Nothing is reachable by real users.
   **Recommendation (2026-07-24):** Firebase Hosting for the frontend — same project,
   deploys via the same `firebase deploy` family of commands already used for
   firestore/auth, and lets the backend (below) live on the same domain via rewrites
   (no CORS between frontend and API). Backend: Firebase Cloud Functions (2nd gen,
   Node.js/TypeScript) in this same project rather than a separate host — the Admin
   SDK gets trusted Firestore access and Firebase Auth token verification for free,
   and the only backend jobs actually needed right now (payment webhook, checkout
   session, scheduled reservation cleanup — see #9) are exactly what Cloud Functions
   are for. **Keep security first-class while building this (see #33):** verify
   webhook signatures, restrict callable functions to authenticated callers, never
   log secrets/tokens, and treat this as the moment to also pair in Firebase App
   Check (#5) — not something to bolt on after launch.
2. **Delete the throwaway test accounts** in the real Firebase Auth project
   (`megapronanoultawidepetprogect`): `test-1784677756418@example.com`,
   `layout-test-1784678721080@example.com`, `layout-test-1784678776979@example.com`,
   `layout-test-1784678891802@example.com`, `layout-test2-1784678900999@example.com`,
   plus one more added 2026-07-23 during #7 verification (`publish-test-*@example.com`).
   No delete-user tool is available via the Firebase MCP — do this manually in
   Console → Authentication → Users.
3. **Confirm Firebase billing plan** (Blaze vs Spark) is right for expected usage.
   **Note (2026-07-24):** this becomes a hard requirement, not a nice-to-have, once
   Cloud Functions land (see #1/#9) — Spark cannot run Cloud Functions at all. Cost at
   current MVP scale should be near-zero, but upgrading the plan is a billing decision
   for the user to make consciously, not something to flip silently.
4. **Auth production readiness** — add the production domain to Firebase Auth's
   Authorized domains; publish the Google OAuth consent screen for public users.
5. **Firebase App Check** — Firestore/Auth are reachable by any client holding the
   public web config, with no bot/abuse protection.
6. **Error monitoring** (Sentry or equivalent) — production runtime errors are
   currently invisible.
7. ✅ **Wire Create Game's `publish()` to actually persist** a `games` Firestore
   document. Done — `store/createGame`'s `publish()` builds a real payload (resolving
   a known venue's lat/lng, or falling back to a Wrocław-center constant when no
   geocoding API is connected yet, see #11) and calls a new `addGame` in
   `services/{mock,firebase}/games.ts`. `firestore.rules` updated to allow a signed-in
   `create` (was `if false`) with `status=='open'`, `seatsTaken==0`, `seatsTotal>0`
   guards, validated and deployed. Verified end-to-end live against the real project:
   published a throwaway game through the real UI, confirmed via
   `firestore_query_collection` that the document existed with the exact expected
   shape, then deleted it via `firestore_delete_document`. Organizer tracking added
   later same session, see #14.
8. ✅ **Cancel/leave-a-game flow.** Done — player can cancel a `PENDING_PAYMENT`
   registration (anytime before paying, before the 3h auto-expiry window kicks in);
   cancelling
   an already-`PAID` registration is blocked in the UI (button hidden once paid) per
   the user's explicit rule. New `cancelRegistration` in `services/{mock,firebase}/
   bookings.ts` (transaction: decrement `seatsTaken`, delete the registration doc).
   `firestore.rules` games `update` now allows a `-1` seat delta too (was increment-
   only). **3h auto-expiry is a lazy sweep**, not a real cron: `booking.
   loadMyRegistrations` checks each pending registration's `createdAt` against a
   3h window (`utils/helpers/bookingExpiry.ts`) and auto-cancels expired ones —
   this only runs when the affected player's own client loads their registrations
   (e.g. opens Cabinet), since Cloud Functions aren't wired up yet (blocked on
   #3's billing decision) and Firestore rules can't let a random client touch
   someone else's registration otherwise. A real background expiry needs a Cloud
   Function once Blaze is confirmed. Cancel buttons wired into Cabinet's Upcoming
   list and `PaymentFollowup` (join → cancel resets to the Join button). Verified
   live end-to-end against the real project (join → cancel → seat freed; join →
   pay → cancel option correctly gone).
9. **Real payment processor** (Stripe via a Cloud Function) — `PaymentFollowup`
   currently just flips a status flag client-side; no money ever moves.
   **Security finding (2026-07-24):** this is worse than "no processor yet" — it's an
   active hole. `PaymentFollowup`'s card-number/CVV/expiry fields aren't wired to
   anything; the Pay button calls `payCurrent()` → `markRegistrationPaid()` → a plain
   `updateDoc(status: 'paid')`. `firestore.rules`'s `registrations.update` only checks
   *which* field changed (`hasOnly(['status'])`), never what value it's set to — so
   any signed-in user can open devtools and set their own registration to `paid`
   directly, getting every game for free with zero fraud detection. This needs fixing
   regardless of when Stripe actually lands: only a Cloud Function (via Admin SDK)
   should ever be allowed to write `status: 'paid'`; the client should lose write
   access to that transition entirely.
   **Recommended shape:** Stripe (supports card + Google/Apple Pay + BLIK, relevant
   for the Polish market this app targets) via three Cloud Functions — (a) an HTTP
   webhook endpoint that verifies Stripe's signature and is the *only* writer of
   `status: 'paid'`, (b) a callable function that creates a Checkout Session
   (replaces the current fake card form), (c) a scheduled function that expires
   stale `pending_payment` registrations and frees seats server-side — this also
   finally fixes #8's "lazy sweep" limitation (today a squatted seat only frees up
   if that same user's own client happens to reopen their bookings). **This is the
   highest-stakes item for security (real money moving) — review the webhook/rules
   changes for abuse cases (replay attacks, race conditions on the seat-count
   transaction, idempotency) as part of building it, per #33, not as a later pass.**
10. ✅ **Delete Account actually deletes data** — real Firebase Auth user deletion +
    purge of `registrations`/`teamMemberships`. Done and verified live.
11. **Connect Google Maps Platform** (`VITE_GOOGLE_MAPS_API_KEY`) — `GoogleMapView`
    exists, just needs a real key; currently falls back to `MockMap`.
12. ✅ **Real "Forgot password"** — wired to Firebase's `sendPasswordResetEmail`. Done.
13. ✅ **Avatar — redefined by the user to fixed presets, not photo upload.** Custom
    photo upload is explicitly out for now. Original artwork: the user's initial
    icon pack (`public/avatars/`) turned out to be Rick and Morty/Disney/Pepe the
    Frog characters — flagged as a copyright + (for Pepe) reputational risk for a
    commercial app, user asked to replace with generated/public-domain-alike art.
    Replaced with 15 wholly original flat-vector "blob" mascot SVGs (own artwork,
    `public/avatars/blob-*.svg`, generated via a one-off script, no traced/derived
    characters), referenced by `utils/constants/avatarPresets.ts` (`{id, image}`).
    Picked via a reka-ui `RadioGroup` image grid in `AvatarPickerModal` (renamed
    from `AvatarUploadModal`), persisted via `useAvatarPreset` (renamed from
    `useAvatarPhoto`). **New profiles get a random preset by default**
    (`pickRandomAvatarPreset()` seeds `useStorage`'s default) until the user
    changes it. Verified live — random default shown on first sign-in, picker
    renders all 15 images, picking one updates sidebar + Settings instantly.
14. **Organizer tools — partially done.** Done: every new game now stores
    `organizerId` (the creator's uid); a "Hosting" tab in Cabinet lists an
    organizer's own games with a roster (`GameRoster` component) showing each
    registrant's `userId` + status; the organizer can remove a still-unpaid
    (`PENDING_PAYMENT`) registrant, which frees the seat (reuses #8's
    `cancelRegistration`). Same `GameRoster` also appears on the game detail page
    for the organizer, or for a **superadmin** (see below). `firestore.rules`
    updated: `registrations` read/delete now also allowed for
    `isOrganizerOf(gameId)` (a `get()` cross-check against `games.organizerId`) or
    `isSuperAdmin()` (`request.auth.token.admin == true` custom claim). Verified
    live with two real accounts (organizer + a joining player): roster showed the
    join, remove correctly freed the seat and deleted the registration.
    **Still open / explicit limitations, not done:**
    - Removing an already-**paid** participant is blocked (same guard as #8) —
      no refund flow exists yet (#9), so forcibly kicking a paying customer with
      no refund was deliberately not built. Needs a decision once #9 lands.
    - Editing game details (title/time/price) by the organizer — not built, only
      roster management.
    - Messaging participants — not built.
    - **Security finding (2026-07-24):** `firestore.rules`'s `games.create` checks
      `status`/`seatsTaken`/`seatsTotal` but never checks
      `request.resource.data.organizerId == request.auth.uid`, and validates no
      other fields (price, title, etc.). Any signed-in user can currently create a
      game with `organizerId` set to *someone else's* uid — which grants that other
      uid organizer-level read access to registrations via `isOrganizerOf()` —
      or submit malformed data (negative price, missing title). Worth closing
      alongside #9's rules work.
    - ✅ **Superadmin claim granted 2026-07-23** — `andrew.konash@gmail.com`
      (uid `wdmAakL9piUksQo76ne8p86aoSj2`) now has custom claim `admin: true`,
      set via `mcp__firebase__auth_update_user`. Note: an already-open browser
      session won't see this until the user signs out/in again or the Firebase
      ID token auto-refreshes (~hourly) — the claim lives on the token, not the
      live session.
    - The "Hosting" tab's game card seat count can go stale until the tab is
      re-entered (one-shot fetch, not a realtime listener) — cosmetic only, the
      roster itself is always fetched fresh.
15. **Real push/in-app notifications** (FCM) — `NotificationsBell` is 100% local
    mock data (3 hardcoded samples).
16. **Legal review of Terms/Privacy/Safety/Support** — currently generic 5-section
    placeholder copy.
17. **GDPR minimal-effort pass** — no cookie banner needed (zero third-party
    tracking today). (a) account/data deletion — done, ties to #10. (b) `/privacy`
    copy — already rewritten honestly across all 5 locales. Firestore region
    confirmed `eur3` (EU, Belgium) — no migration needed.
18. **Skill-level matching** — `skillLevel` captured at game creation but never
    surfaced as a filter or matching signal.
19. **Recurring games** — no way to create a weekly/repeating game series.
20. **E2E/browser test suite in CI** — current coverage is unit/integration only
    (47 tests); no automated browser testing committed to the repo.
21. **Onboarding / first-run experience** — no tutorial or guided first run.
22. **Multi-city support** — `common.city` ("Wrocław") hardcoded app-wide.
23. **Post-game rating / reliability system** — `landing.features.trackStats`
    already promises this in marketing copy; doesn't exist functionally.
24. **Waitlist for full games** — auto-notify when a spot opens.
25. **Transactional email/SMS reminders** before a game starts (Firebase Extensions
    + SendGrid, or Twilio for SMS).
26. ✅ **Open Graph meta tags** for shared game links. Done (static, not per-game —
    no SSR/prerendering, so `/game/:id` won't get a dynamic preview).
27. **Referral / invite loop** — not built.
28. **Real subscription/paid tiers** — sidebar shows a "Free Plan" badge
    (Admin/VIP concepts in UI), but no actual upgrade flow or gating logic.
29. **Instagram integration** — user wants this; exact scope not yet defined. Needs
    a scoping conversation before implementation.
30. **AI-written announcements for Telegram groups** — needs Telegram Bot API
    (bot token + target group/channel) + an LLM call to draft copy from game data.
31. ✅ **PWA** (manifest + service worker + installability) — basic version done.
    Caveat: manifest icon is SVG-only, no PNG rasterization done — fine for
    Android/Chrome/Edge, iOS "Add to Home Screen" ordinarily wants a PNG
    `apple-touch-icon`.
32. **∞ — Native mobile apps** (iOS/Android, e.g. via Capacitor or full native
    rewrite). Explicitly flagged by the user as a separate, much larger budget item
    ("это другие расходы") — not committed, just tracked as the long-term end state.
33. **Full security audit (added 2026-07-24, user explicitly flagged security as an
    ongoing priority).** Not numbered by priority-position — despite sitting last in
    the list, this should run alongside #1/#9/#14, not after everything else. Beyond
    the Firestore-rules issues already found (payment bypass in #9, `organizerId`
    spoofing in #14), do a dedicated pass covering: auth flows (session handling,
    token refresh, OAuth redirect/authorized-domain config, ties to #4), XSS/injection
    surface in any user-supplied text the app renders (game titles/descriptions,
    bios), dependency vulnerabilities (`pnpm audit`), Firebase App Check (#5) as an
    anti-abuse layer once real traffic exists, and end-to-end data handling (ties to
    #16/#17's GDPR pass). Best run as a full pass once hosting+backend (#1) and
    payments (#9) exist, so the real attack surface — including the new Cloud
    Functions/webhook endpoints — is actually in scope, not just today's Firestore
    rules.

## Currently open (not yet done)

1, 2, 3, 4, 5, 6, 9, 11, 14 (partial — see limitations above), 15, 16, 18, 19, 20,
21, 22, 23, 24, 25, 27, 28, 29, 30, 32, 33
