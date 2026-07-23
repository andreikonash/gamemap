import { describe, it, expect, vi, afterEach } from 'vitest'
import { getStartPosition, WROCLAW_CENTER } from '@/components/features/Map/helpers/startPosition'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('getStartPosition', () => {
  it('returns the user position when geolocation succeeds', async () => {
    vi.stubGlobal('navigator', {
      geolocation: {
        getCurrentPosition: (success: PositionCallback) =>
          success({ coords: { latitude: 50.06, longitude: 19.94 } } as GeolocationPosition)
      }
    })

    await expect(getStartPosition()).resolves.toEqual({ lat: 50.06, lng: 19.94 })
  })

  it('falls back to Wroclaw when the user denies geolocation', async () => {
    vi.stubGlobal('navigator', {
      geolocation: {
        getCurrentPosition: (_: PositionCallback, error: PositionErrorCallback) =>
          error({ code: 1 } as GeolocationPositionError)
      }
    })

    await expect(getStartPosition()).resolves.toEqual(WROCLAW_CENTER)
  })

  it('falls back to Wroclaw when geolocation is not available', async () => {
    vi.stubGlobal('navigator', {})

    await expect(getStartPosition()).resolves.toEqual(WROCLAW_CENTER)
  })
})
