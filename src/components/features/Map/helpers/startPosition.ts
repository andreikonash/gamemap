import type { ILatLng } from '@/types/game'

const WROCLAW_CENTER: ILatLng = { lat: 51.1079, lng: 17.0385 }
const START_ZOOM = 13
const GEOLOCATION_TIMEOUT_MS = 5000

function getStartPosition (): Promise<ILatLng> {
  if (!navigator.geolocation) return Promise.resolve(WROCLAW_CENTER)
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => resolve(WROCLAW_CENTER),
      { timeout: GEOLOCATION_TIMEOUT_MS }
    )
  })
}

export { getStartPosition, WROCLAW_CENTER, START_ZOOM }
