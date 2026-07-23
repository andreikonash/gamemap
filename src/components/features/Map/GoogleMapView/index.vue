<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { GoogleMap, MarkerCluster } from 'vue3-google-map'
import { useDebounceFn } from '@vueuse/core'
import GameMarker from '@/components/features/Map/GameMarker/index.vue'
import { getStartPosition, WROCLAW_CENTER, START_ZOOM } from '@/components/features/Map/helpers/startPosition'
import { games } from '@/store/games'
import { GOOGLE_MAPS_API_KEY } from '@/utils/constants/env'
import type { ILatLng } from '@/types/game'

defineOptions({ name: 'GoogleMapView' })

const router = useRouter()
const gamesStore = games()

const mapRef = ref<InstanceType<typeof GoogleMap> | null>(null)
const center = ref<ILatLng>(WROCLAW_CENTER)

gamesStore.listenToGames()

getStartPosition().then((position) => {
  center.value = position
})

const reportBounds = useDebounceFn(() => {
  const bounds = mapRef.value?.map?.getBounds()
  if (!bounds) return
  const northEast = bounds.getNorthEast()
  const southWest = bounds.getSouthWest()
  gamesStore.setBounds({
    north: northEast.lat(),
    east: northEast.lng(),
    south: southWest.lat(),
    west: southWest.lng()
  })
}, 300)

let boundsListener: google.maps.MapsEventListener | null = null

watch(
  () => mapRef.value?.ready,
  (ready) => {
    if (!ready || !mapRef.value?.map) return
    boundsListener = mapRef.value.map.addListener('bounds_changed', reportBounds)
  }
)

onBeforeUnmount(() => {
  boundsListener?.remove()
})

function openGame (gameId: string) {
  router.push({ name: 'game', params: { id: gameId } })
}
</script>

<template>
  <GoogleMap
    ref="mapRef"
    :api-key="GOOGLE_MAPS_API_KEY"
    :center="center"
    :zoom="START_ZOOM"
    class="game-map"
    :street-view-control="false"
    :map-type-control="false"
  >
    <MarkerCluster>
      <GameMarker
        v-for="game in gamesStore.games"
        :key="game.id"
        :game="game"
        @select="openGame"
      />
    </MarkerCluster>
  </GoogleMap>
</template>

<style scoped>
.game-map {
  width: 100%;
  height: 100%;
}
</style>
