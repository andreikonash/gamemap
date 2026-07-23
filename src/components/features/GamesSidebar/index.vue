<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ToggleGroupItem, ToggleGroupRoot } from 'reka-ui'
import FiltersModal from '@/components/features/GamesSidebar/FiltersModal/index.vue'
import GameCard from '@/components/features/GamesSidebar/GameCard/index.vue'
import { EmptyState, Icon } from '@/components/ui'
import { useMobile } from '@/composables/useMobile'
import { booking } from '@/store/booking'
import { games } from '@/store/games'
import { isGameJoinable } from '@/utils/helpers/gameStatus'
import type { IGame } from '@/types/game'

defineOptions({ name: 'GamesSidebar' })

const GAMES_FILTER = {
  ALL: 'all',
  OPEN: 'open',
  ASSIGNED: 'assigned'
} as const

const SPORT_KEYWORD_BY_VALUE: Record<string, string> = {
  football: 'football',
  basketball: 'basketball',
  volleyball: 'volleyball',
  tennis: 'tennis',
  squash: 'squash',
  badminton: 'badminton',
  running: 'run',
  tableTennis: 'table tennis'
}

type IGamesFilter = typeof GAMES_FILTER[keyof typeof GAMES_FILTER]

const { t } = useI18n()
const router = useRouter()
const gamesStore = games()
const bookingStore = booking()
const mobile = useMobile()

const showFiltersModal = ref(false)
const sportFilter = ref<string | null>(null)
const maxPriceFilter = ref<number | null>(null)

const FILTERS = computed<Array<{ key: IGamesFilter, label: string }>>(() => [
  { key: GAMES_FILTER.ALL, label: t('map.filter.all') },
  { key: GAMES_FILTER.OPEN, label: t('map.filter.open') },
  { key: GAMES_FILTER.ASSIGNED, label: t('map.filter.assigned') }
])

const activeFilter = ref<IGamesFilter>(GAMES_FILTER.ALL)

const visibleGames = computed(() => gamesStore.visibleGames)
const assignedGameIds = computed(() =>
  new Set(bookingStore.myRegistrations.map((registration) => registration.gameId))
)

function matchesActiveFilter (game: IGame): boolean {
  if (activeFilter.value === GAMES_FILTER.OPEN) return isGameJoinable(game)
  if (activeFilter.value === GAMES_FILTER.ASSIGNED) return assignedGameIds.value.has(game.id)
  return true
}

function matchesAdvancedFilters (game: IGame): boolean {
  const matchesSport = !sportFilter.value ||
    game.title.toLowerCase().includes(SPORT_KEYWORD_BY_VALUE[sportFilter.value] ?? '')
  const matchesPrice = maxPriceFilter.value == null || game.price <= maxPriceFilter.value
  return matchesSport && matchesPrice
}

const filteredGames = computed(() => {
  const query = gamesStore.searchQuery.trim().toLowerCase()

  return visibleGames.value.filter((game) => {
    const matchesQuery = !query ||
      game.title.toLowerCase().includes(query) ||
      game.address.toLowerCase().includes(query)
    return matchesActiveFilter(game) && matchesAdvancedFilters(game) && matchesQuery
  })
})

const activeAdvancedFiltersCount = computed(() =>
  (sportFilter.value ? 1 : 0) + (maxPriceFilter.value != null ? 1 : 0)
)

// ToggleGroup's single mode deselects (emits undefined) when clicking the active
// item again — a status filter must always keep exactly one option selected.
const statusFilterValue = computed<IGamesFilter>({
  get: () => activeFilter.value,
  set: (value) => {
    if (value) activeFilter.value = value
  }
})

function openGame (gameId: string) {
  router.push({ name: 'game', params: { id: gameId } })
}

function advancedFiltersHandle () {
  showFiltersModal.value = true
}

function applyAdvancedFilters (payload: { sport: string | null, maxPrice: number | null }) {
  sportFilter.value = payload.sport
  maxPriceFilter.value = payload.maxPrice
}
</script>

<template>
  <aside
    class="games-sidebar flex h-full flex-col bg-surface"
    :data-mobile="mobile"
    data-testid="games-sidebar"
  >
    <div class="sticky top-0 z-10 flex items-center justify-between border-b border-outline-variant bg-surface p-md shadow-sm">
      <span class="text-headline-sm text-on-surface">{{ t('map.nearbyGames') }}</span>
      <button
        type="button"
        class="flex min-h-[44px] items-center gap-xs rounded-lg px-3 py-1 text-label-sm text-primary transition-colors hover:bg-surface-container-high"
        @click="advancedFiltersHandle"
      >
        <Icon
          name="filter_list"
          :size="18"
        /> {{ t('map.filterButton') }}
        <span
          v-if="activeAdvancedFiltersCount > 0"
          class="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary-container px-1 text-[11px] font-bold text-white shadow-glow"
        >{{ activeAdvancedFiltersCount }}</span>
      </button>
    </div>
    <ToggleGroupRoot
      v-model="statusFilterValue"
      type="single"
      class="flex gap-sm overflow-x-auto border-b border-outline-variant bg-surface px-md py-2"
      data-testid="status-filters"
    >
      <ToggleGroupItem
        v-for="filter in FILTERS"
        :key="filter.key"
        :value="filter.key"
        class="status-filter-item whitespace-nowrap rounded-full px-4 py-1.5 text-label-md font-semibold text-on-surface-variant outline-none transition-all duration-200 hover:bg-surface-container-high"
        :data-testid="`status-filter-${filter.key}`"
      >
        {{ filter.label }}
      </ToggleGroupItem>
    </ToggleGroupRoot>
    <EmptyState
      v-if="visibleGames.length === 0"
      icon="map"
      :title="t('map.emptyNoGames.title')"
      :description="t('map.emptyNoGames.description', { city: t('common.city') })"
      data-testid="games-sidebar-empty"
    />
    <EmptyState
      v-else-if="filteredGames.length === 0"
      icon="search_off"
      :title="t('map.emptyNoMatches.title')"
      :description="t('map.emptyNoMatches.description')"
      data-testid="games-sidebar-filtered-empty"
    />
    <TransitionGroup
      name="card-list"
      tag="div"
      class="flex-1 overflow-y-auto p-md"
    >
      <GameCard
        v-for="(game, index) in filteredGames"
        :key="game.id"
        :game="game"
        class="mb-md"
        :style="{ '--card-enter-delay': `${index * 30}ms` }"
        @select="openGame"
      />
    </TransitionGroup>

    <FiltersModal
      v-model="showFiltersModal"
      :sport="sportFilter"
      :max-price="maxPriceFilter"
      @apply="applyAdvancedFilters"
    />
  </aside>
</template>

<style scoped>
.games-sidebar {
  overflow: hidden;
}

.status-filter-item[data-state='on'] {
  background-image: linear-gradient(to right, var(--color-primary), var(--color-primary-container));
  color: var(--color-on-primary);
  box-shadow: var(--shadow-glow);
}

.card-list-enter-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
  transition-delay: var(--card-enter-delay, 0ms);
}

.card-list-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.card-list-enter-from,
.card-list-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
