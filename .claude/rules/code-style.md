## Code Quality Principles

- Prefer early returns over deep nesting, reduce unnecessary nesting
- Use early returns instead of `else` after `return`
- Prefer explicit code over compact
- Improve readability through clear variable and function names (even if name could be long)
- Weigh complexity cost against improvement. Removing code for equal results is a win

Before finishing work, verify:
- [ ] No `any` types
- [ ] DO NOT insert task numbers in comments
- [ ] No `console.log` calls
- [ ] No TypeScript or ESLint errors — full `pnpm typecheck && pnpm lint` is green (after each `.ts`/`.vue`)
- [ ] All tests pass (`pnpm test:unit`) — no exceptions, even for pre-existing failures
- [ ] No unused imports or variables
- [ ] Path aliases used (path alias: `@/` maps to `./src/` - no relative `../` imports crossing module boundaries)

## Constraints

- Avoid comments — no obvious or redundant comments
- **Don't** use enums. Use this as an example:
```typescript
const FILE_STATUS = {
  LOADING: 'loading',
  DONE: 'done',
  ERROR: 'error'
} as const

type IFileStatus = typeof FILE_STATUS[keyof typeof FILE_STATUS]
export { FILE_STATUS, IFileStatus }
```
- Eliminate redundant abstractions
- **Don't** create git commits — user commits manually
- **Don't** add translations in json files, just add english mock with translation wrapper: `t('Hello')`
- **Don't** use default exports — use named exports only
- **Don't** refactor existing modules unless explicitly asked
- **Don't** add features, refactor, or "improve" code beyond what was asked
- **Don't** add comments, docstrings, or type annotations to code you didn't change
- **Don't** combine too many concerns into single functions
- **Don't** over-simplify — keep helpful abstractions that improve organization
- **Don't** prioritize fewer lines over readability (no dense one-liners)
- No nested ternary operators — use switch or if/else for multiple conditions
- Do not create several storages in one scope, create variable at the top
```typescript
// bad
function () {
  const isLoggedIn = auth().getSession.active
  if (!isLoggedIn) return false
  auth().openLoginDialog({ redirect: currentRoute })
}
// good
function () {
  const authStore = auth()
  const isLoggedIn = authStore.getSession.active
  if (!isLoggedIn) return false
  authStore.openLoginDialog({ redirect: currentRoute })
}
```

## Typescript

- **Don't** use `any` (use `unknown` if truly needed), `ts-ignore`, or `as unknown as Type` casts
- No `any` (use `unknown` if truly needed), no `ts-ignore`, no `as unknown as Type` casts
- Use `type` for data structures, `interface` for contracts
- Use `const` over `let`; prefer immutability, don't mutate input objects
- Use `async/await`, avoid `.then()/.catch()`
- Avoid eslint disablings

## Naming

**Code:**
- Classes: PascalCase — `GameService`, `CreateBookingUseCase`
- Interfaces and Types: PascalCase + "I" prefix — `ISomeType`
- Generic types: PascalCase + "T" prefix — `IGenericInterface<TGenericType>`
- Variables/functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Verbs for functions (`createBooking`), nouns for classes (`GameService`)
- **Don't** use verbs for pinia store getters, use nouns instead
- **Use simple English words** — target **A2-B1** level in all names (variables, functions, classes). Prefer short, common words over rare or academic ones — e.g. `get` not `retrieve`, `show` not `display`, `start` not `initiate`.

## Functions & Classes

- Single responsibility — each function does one thing

## Barrel Exports

Each subdirectory has `index.ts/index.vue` re-exporting contents. Import from barrels:
```typescript
// good
import { Some, FileProvider } from '../interface';
// bad
import { Some } from '../interfaces/some';
```

## Styling (Material UI)

- **Use the design system's components and tokens first.** Reach for Material UI (Vuetify) components and their props/utility helpers before writing custom CSS. Only add scoped `<style>` when the component library can't express the rule.
- **Create a CSS class only if CSS or JS actually targets it.** Classes that exist only as DOM markers (semantic wrappers, BEM names that no selector references) are noise — remove them and inline the styles.
- **Prefer `data-*` attributes for state** (e.g. `:data-phase="phase"`, then `[data-phase="animating"]` in CSS) over multiple modifier classes like `--animating`, `--fading`. One attribute reads cleaner than three conditional classes.
- **Use inline `style="..."`** for trivial one-off values (`animation-delay: 600ms`, dynamic transforms, single-element offsets) instead of inventing a class just to hold them.

## Debugging & Refactoring Protocol for Claude Code

When assigned a bug fix, troubleshooting task, or refactoring request, strictly adhere to the following execution flow:

1. **Context Isolation:** Identify the relevant files within the project layers (state store, services, UI components). Do not index or modify unrelated modules.
2. **Reproduce First (For Bugs):**
  - Locate or create the corresponding `.spec.ts` file.
  - Write a deterministic unit test reproducing the bug.
  - Run the suite with `pnpm test:run` and verify the new test fails.
3. **Implementation:**
  - Apply fixes ensuring full compliance with the guidelines above (Early returns, Named exports, No enums).
  - If working with Pinia, verify that `state` remains a factory function (`createInitialState`) and avoid reference leaks or deep object mutations.
4. **Verification & Cleanup:**
  - Each `.ts`/`.vue` edit auto-triggers the `edit-check.sh` hook (`pnpm typecheck` + `pnpm lint:file <file>`, which also auto-fixes that file) — read its output and resolve anything it reports. To re-lint one file on demand, run `pnpm lint:file <path>`.
  - Wipe out all temporary `console.log` statements, debugging utilities, or commented-out code snippets.
  - Before declaring the task complete, run the full gate: `pnpm typecheck`, `pnpm lint`, and `pnpm test:run`.
