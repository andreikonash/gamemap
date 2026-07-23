---
paths:
  - "**/*.vue"
  - "src/store/**"
  - "src/composables/**"
---

## Vue components

- Always define a component name:
  ```typescript
  defineOptions({ name: 'ComponentName' })
  ```
- Use `defineAsyncComponent` if component loading is conditional or deferred.
- Use `<script setup>` (Composition API) for new modules.
- Do not rewrite an existing component's API just to change its style. Match the pattern already used in the module you are editing.

## Pinia stores

- **`state` must be a factory function**, never a shared `const`. Shallow-copying a const via `Object.assign` leaks references and breaks resets:
  ```typescript
  // good
  function createInitialState(): IFooState {
    return { items: [], filters: { tag: null } }
  }
  export const foo = defineStore('foo', { state: createInitialState })
  ```
- Inline nested initial values inside `createInitialState`. Extract a sub-factory only when it has 2+ call sites.
- Don't use verbs for getters — use nouns (`getSession`, not `checkSession`).
- Don't instantiate multiple stores in one scope. Declare one variable at the top:
  ```typescript
  // good
  function handleAction() {
    const authStore = auth()
    const isLoggedIn = authStore.getSession.active
    if (!isLoggedIn) return false
    authStore.openLoginDialog({ redirect: 'game_page' })
  }
  ```

## VueUse

Check VueUse before writing manual DOM listeners, observers, or custom composables:
- `onClickOutside` — click-away actions (not native event directives)
- `useWindowSize` — responsive layout
- `useIntersectionObserver` — element visibility tracking
- `useStorage` — persistent local storage state

## Internationalization

Don't hardcode strings in translation JSON files. Wrap text with `t()` using an English mock:
```html
<p>{{ t('Hello') }}</p>
```

## UI components

Extend the chosen design system (Material UI / Vuetify) rather than introducing alternative UI kits. Before adding a new dependency for a widget the design system already provides (dialogs, menus, snackbars, data tables, date pickers), use the existing one.
