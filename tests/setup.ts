import { vi } from 'vitest'

class ResizeObserverStub {
  observe () {}
  unobserve () {}
  disconnect () {}
}

vi.stubGlobal('ResizeObserver', ResizeObserverStub)

vi.stubGlobal('matchMedia', (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false
}))

vi.stubGlobal('visualViewport', new EventTarget())
