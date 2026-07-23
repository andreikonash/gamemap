import { describe, it, expect } from 'vitest'
import { getSportIcon, getSportLabel } from '@/utils/helpers/sportIcon'

describe('getSportIcon', () => {
  it('matches a known sport keyword in the title', () => {
    expect(getSportIcon('Football 5v5 — Old Town')).toBe('sports_soccer')
  })

  it('falls back to a generic icon when no sport keyword matches', () => {
    expect(getSportIcon('Mystery Game Night')).toBe('sports')
  })
})

describe('getSportLabel', () => {
  it('labels a known sport keyword in the title', () => {
    expect(getSportLabel('Basketball 3x3 — Nadodrze')).toBe('Basketball')
  })

  it('falls back to a generic label when no sport keyword matches', () => {
    expect(getSportLabel('Mystery Game Night')).toBe('Game')
  })
})
