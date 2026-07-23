import { describe, it, expect } from 'vitest'
import { formatDuration } from '@/utils/helpers/formatDuration'

describe('formatDuration', () => {
  it('formats a whole-hour duration', () => {
    expect(formatDuration(60)).toBe('1h')
  })

  it('formats a half-hour duration', () => {
    expect(formatDuration(150)).toBe('2.5h')
  })

  it('rounds an odd duration to the nearest half hour', () => {
    expect(formatDuration(50)).toBe('1h')
  })
})
