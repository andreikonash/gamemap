<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import MarkerPin from '@/components/features/Map/MarkerPin/index.vue'
import { WROCLAW_CENTER } from '@/components/features/Map/helpers/startPosition'
import { Chip } from '@/components/ui'
import { games } from '@/store/games'
import type { IGame, ILatLng } from '@/types/game'

defineOptions({ name: 'MockMap' })

const { t } = useI18n()

const START_PX_PER_DEGREE = 4000
const ZOOM_STEP = 1.5

const router = useRouter()
const gamesStore = games()

const containerRef = ref<HTMLDivElement | null>(null)
const center = ref<ILatLng>({ ...WROCLAW_CENTER })
const pxPerDegree = ref(START_PX_PER_DEGREE)

gamesStore.listenToGames()

function markerStyle (game: IGame) {
  const box = containerRef.value
  if (!box) return { display: 'none' }
  const x = (game.location.lng - center.value.lng) * pxPerDegree.value + box.clientWidth / 2
  const y = (center.value.lat - game.location.lat) * pxPerDegree.value + box.clientHeight / 2
  return { left: `${x}px`, top: `${y}px` }
}

function reportBounds () {
  const box = containerRef.value
  if (!box) return
  const halfLat = box.clientHeight / 2 / pxPerDegree.value
  const halfLng = box.clientWidth / 2 / pxPerDegree.value
  gamesStore.setBounds({
    north: center.value.lat + halfLat,
    south: center.value.lat - halfLat,
    east: center.value.lng + halfLng,
    west: center.value.lng - halfLng
  })
}

onMounted(reportBounds)

let dragFrom: { x: number, y: number } | null = null

function dragStart (event: PointerEvent) {
  dragFrom = { x: event.clientX, y: event.clientY }
}

function dragMove (event: PointerEvent) {
  if (!dragFrom) return
  center.value = {
    lat: center.value.lat + (event.clientY - dragFrom.y) / pxPerDegree.value,
    lng: center.value.lng - (event.clientX - dragFrom.x) / pxPerDegree.value
  }
  dragFrom = { x: event.clientX, y: event.clientY }
  reportBounds()
}

function dragEnd () {
  dragFrom = null
}

function zoomIn () {
  pxPerDegree.value = pxPerDegree.value * ZOOM_STEP
  reportBounds()
}

function zoomOut () {
  pxPerDegree.value = pxPerDegree.value / ZOOM_STEP
  reportBounds()
}

function recenter () {
  center.value = { ...WROCLAW_CENTER }
  pxPerDegree.value = START_PX_PER_DEGREE
  reportBounds()
}

function openGame (gameId: string) {
  router.push({ name: 'game', params: { id: gameId } })
}
</script>

<template>
  <div
    ref="containerRef"
    class="mock-map"
    data-testid="mock-map"
    @pointerdown="dragStart"
    @pointermove="dragMove"
    @pointerup="dragEnd"
    @pointerleave="dragEnd"
  >
    <div
      v-for="game in gamesStore.games"
      :key="game.id"
      class="mock-map__marker"
      :style="markerStyle(game)"
    >
      <MarkerPin
        :game="game"
        @select="openGame"
      />
    </div>
    <Chip
      class="mock-map__badge"
      color="var(--color-primary)"
    >
      {{ t('map.demoNotice') }}
    </Chip>
    <div class="mock-map__controls">
      <button
        type="button"
        class="mock-map__control-btn mock-map__control-btn--round"
        :aria-label="t('map.recenter')"
        @click="recenter"
      >
        <span class="material-symbols-outlined text-[20px]">my_location</span>
      </button>
      <div class="mock-map__zoom-group">
        <button
          type="button"
          class="mock-map__control-btn"
          :aria-label="t('map.zoomIn')"
          @click="zoomIn"
        >
          <span class="material-symbols-outlined text-[20px]">add</span>
        </button>
        <button
          type="button"
          class="mock-map__control-btn"
          :aria-label="t('map.zoomOut')"
          @click="zoomOut"
        >
          <span class="material-symbols-outlined text-[20px]">remove</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mock-map {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: grab;
  touch-action: none;
  background-color: color-mix(in srgb, var(--color-text) 6%, var(--color-bg));
  background-image:
    linear-gradient(color-mix(in srgb, var(--color-text) 8%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--color-text) 8%, transparent) 1px, transparent 1px);
  background-size: 48px 48px;
}

.mock-map:active {
  cursor: grabbing;
}

.mock-map__marker {
  position: absolute;
  transform: translate(-50%, -100%);
}

.mock-map__badge {
  position: absolute;
  inset-block-start: 12px;
  inset-inline-start: 12px;
}

.mock-map__controls {
  position: absolute;
  inset-block-end: 40px;
  inset-inline-end: 40px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mock-map__control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background-color: var(--color-surface);
  color: var(--color-on-surface);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  transition: background-color 0.2s ease;
}

.mock-map__control-btn:hover {
  background-color: var(--color-surface-container-high);
}

.mock-map__control-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.mock-map__control-btn--round {
  border-radius: 9999px;
}

.mock-map__zoom-group {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.mock-map__zoom-group .mock-map__control-btn {
  box-shadow: none;
}

.mock-map__zoom-group .mock-map__control-btn:first-child {
  border-block-end: 1px solid var(--color-outline-variant);
}
</style>
