---
paths:
  - "src/**/*.spec.ts"
  - "src/**/*.spec.vue"
  - "tests/**"
---

# Testing

Two levels: **unit** and **integration**. Pick the lowest level that can honestly verify the behavior.

## Testing Strategy

Unit tests are the primary layer. Integration tests cover a feature wired to real stores.

| What                                                                 | Test type   | Notes                                                            |
|----------------------------------------------------------------------|-------------|------------------------------------------------------------------|
| Store getters/actions with branching logic                           | Unit        | Multiple conditions, error paths                                 |
| Business logic in `store/*/helpers`, `utils/helpers`                 | Unit        | Transforms, limits, validation                                   |
| Pure utility functions                                               | Unit        | Input → output, branches                                         |
| Composables with logic                                               | Unit        | Call directly; assert returned state/effects                     |
| API clients (`services/api`)                                         | Unit        | Mock the HTTP layer; test mapping + error handling               |
| Component behavior (conditional render, emitted events, prop-driven) | Unit        | `mount` + `createTestingPinia`                                   |
| A feature across real stores ("user did X → state/UI became Y")      | Integration | Real stores, mock only `@/services/api`                          |
| Purely presentational components (no logic)                          | Skip        | Markup only — covered when part of a flow                        |
| Pass-through wrappers / re-exports                                   | Skip        | No standalone logic                                              |
| Router / Pinia / framework wiring                                    | Never       | Vue's job, not ours                                              |
| Third-party component or library internals                           | Never       | Mocked at the boundary                                           |
| CSS / class names as such                                            | Never       | Unless a class actually drives behavior                          |
| Logger / analytics internals                                         | Never       | Assert an analytics event only when firing it is the requirement |

**Rule of thumb:** test YOUR logic and YOUR component's observable behavior. Don't test that Vue/Pinia/Router plumbing fires — that's framework code, not yours.

## Principles

- **Behavior, not implementation.** Assert what the user or the calling code observes — rendered output, emitted events, returned values, store state. Not private internals a refactor would change. A test that breaks on a behavior-preserving refactor is testing the wrong thing.
- **Honest assertions.** Every test has a meaningful assertion; `expect(wrapper.exists()).toBe(true)` alone is not a test. The test must fail if the implementation breaks — if you can't make it fail by breaking the code, it isn't testing that code.
- **One test per distinct behavior.** Cover each branch and outcome once. Don't re-assert symmetric *mirror* cases (`A→B` and `B→A`, or the same branch with swapped values): they exercise the identical code path and add noise, not coverage. Rule of thumb — if two cases can only pass or fail together, keep one. Add a second only when the input is genuinely different and a refactor could mishandle it specifically (e.g. an `undefined`/empty/legacy edge), and say in the test name why it's distinct.
- **Don't test the obvious, and don't double-cover.** A test earns its place only by guarding a decision that could plausibly break in a way nothing else catches. **Skip it** when (a) the code has no real branching — a pass-through, thin delegate, rename, or a mapping the type system already guarantees — or (b) a higher-level test already exercises the same logic and would fail if you broke it (confirm by mutation if unsure: break the line, see what goes red). **Line count is not the signal** — a 3-line function encoding a non-obvious rule deserves a test; a long but mechanical one may not. When the *same* rule is reachable from both a unit and an integration test, keep it at the level that also covers something the other can't (usually integration: wiring, persistence, cross-store effects), and drop the redundant unit. Before writing a test, ask: "could a reasonable change break this undetected?" If no, don't write it.
- **Scenario names.** `it('hides the join button when the game is full')`, not `it('works')`.
- **The test-change rule.** A test that fails after you changed code must NOT be silently "adjusted" to pass. Classify first: **regression** (the code is wrong — fix the code) or **deliberate behavior change** (the requirement changed — editing the test is a separate, visible change, call it out in review). Silently rewriting an assertion to match new output is a blocker.
- **No magic numbers — import the constant.** When an expected value comes from a production constant, import it and build the expectation from it (`` `${MAX_VISIBLE_LIST_HEIGHT}px` ``), not the resolved number (`'208px'`). Import the leaf constant, don't re-run the implementation's whole formula (that's tautological).

## Unit Tests

### Location

Next to the file: `clampNumber.ts` → `clampNumber.spec.ts`, `GameCard/index.vue` → `GameCard/index.spec.ts`, `store/games/index.ts` → `store/games/index.spec.ts`.

Shared fixtures live in `tests/fixtures/`, global setup in `tests/setup.ts` — imported via the `@tests` alias (`@tests/fixtures/storeFixtures`).

### What to cover

- Happy path with correct delegation and params.
- Each error branch (failure, validation, limit exceeded).
- Side effects: assert mocks called (or not called) with the expected args.

### Setup & mocking

Mock everything external. Stores via `createTestingPinia`, services via `vi.mock`. Global stubs (like `$t`) live in `tests/setup.ts` — don't re-mock them.

Component behavior — mount with a testing Pinia, assert on emitted events / rendered output:

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import GameCard from '@/components/features/GameCard/index.vue'

function mountCard (props = {}) {
  return mount(GameCard, {
    props,
    global: { plugins: [createTestingPinia()] }
  })
}

describe('GameCard', () => {
  it('emits "join" once when the join button is clicked', async () => {
    const wrapper = mountCard({ game: { id: 'g1', seatsLeft: 2 } })
    await wrapper.get('[data-action="join"]').trigger('click')
    expect(wrapper.emitted('join')).toHaveLength(1)
  })
})
```

Pure logic — call it directly, no mounting:

```typescript
import { describe, it, expect } from 'vitest'
import { clampNumber } from '@/utils/helpers/clampNumber'

describe('clampNumber', () => {
  it('clamps a value above max down to max', () => {
    expect(clampNumber(10, 0, 5)).toBe(5)
  })
})
```

API client — mock the HTTP layer, assert mapping + error handling (match your actual exports):

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('axios')
import axios from 'axios'
import { fetchGames } from '@/services/api/games'

describe('fetchGames', () => {
  beforeEach(() => vi.clearAllMocks())

  it('maps the games list from the response payload', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: { items: [{ id: 'g1' }] } })
    const result = await fetchGames({ bounds: null })
    expect(result[0].id).toBe('g1')
  })
})
```

## Integration Tests

### Location

`tests/integration/<feature-area>/<scenario>.spec.ts` — group by the **feature/flow area** the test asserts, not by store module. Folder names track user-facing areas (`games/`, `booking/`, `auth/`) and are created on demand — don't pre-stamp empty folders.

A test goes in the folder of the feature whose behavior it asserts (the "X" in "user did X → Y"), even when the flow spans several stores — integration tests are cross-store by nature. Name the file for the scenario in kebab-case: `booking/join-game.spec.ts`, `games/filter-by-map-bounds.spec.ts`.

### What to cover

- A whole user flow across real stores: "user did X → state/UI became Y".
- The happy path end to end, plus the branch points that matter at the flow level: an API error surfaces in the UI, a usage limit triggers a paywall, a guest vs. authed path diverges.
- Cross-store effects: an action in one store updates another.
- Keep them coarse and few. One integration test replaces many unit tests for the same flow — don't re-assert pure logic that unit tests already cover.

### Mocking boundary

Real stores and helpers — `createPinia` + `setActivePinia`, **not** `createTestingPinia`. Mock only the network boundary, `@/services/api`. Reset Pinia and mocks in `beforeEach` so flows don't leak state between tests.

### Mounting a feature (the common case)

Most integration tests mount a feature component with a real Pinia and assert the rendered result after the flow. Use one pinia instance for both `setActivePinia` and the mount plugin, and flush the mocked API promises with `flushPromises` before asserting (paths below are illustrative — match your real ones):

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import GamePanel from '@/components/features/Game/GamePanel/index.vue'

vi.mock('@/services/api', () => ({
  Api: { joinGame: vi.fn().mockResolvedValue({ id: 'g1', joined: true }) }
}))

describe('integration: joining a game updates the panel', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    vi.clearAllMocks()
  })

  it('shows the joined state after the user joins', async () => {
    const wrapper = mount(GamePanel, { global: { plugins: [pinia] } })

    await wrapper.get('[data-test="join"]').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Joined')
  })
})
```

### Driving stores directly (no component)

When the flow is purely state — no UI to assert — drive the real stores and check the resulting state:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('@/services/api', () => ({
  Api: { joinGame: vi.fn().mockResolvedValue({ id: 'g1', joined: true }) }
}))

import { games } from '@/store/games'

describe('integration: join adds the game to my games', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('adds the joined game to the user list', async () => {
    await games().joinGame('g1')
    expect(games().myGames.at(-1)?.id).toBe('g1')
  })
})
```

### Seeding state. Fixtures

Reuse `tests/fixtures/storeFixtures.ts` — don't copy-paste setup across tests. Set up the starting point through real store actions or `$patch`, reusing fixtures instead of hand-building state — same fixtures as unit tests.
