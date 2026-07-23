<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon, PhotoPlaceholder } from '@/components/ui'
import { useAppLocale } from '@/i18n'
import { LOCALE_META } from '@/i18n/localeMeta'
import { formatDuration } from '@/utils/helpers/formatDuration'
import { isGameJoinable } from '@/utils/helpers/gameStatus'
import { getGameCardArt, getSportIcon, getSportLabel } from '@/utils/helpers/sportIcon'
import { getStatusUi } from '@/utils/ui/gameStatusUi'
import { GAME_STATUS } from '@/types/game'
import type { IGame } from '@/types/game'

defineOptions({ name: 'GameCard' })

const props = defineProps<{ game: IGame }>()
const emit = defineEmits<{ select: [gameId: string] }>()

const { t } = useI18n()
const appLocale = useAppLocale()

const bcp47Tag = computed(() => LOCALE_META[appLocale.value].bcp47Tag)
const statusUi = computed(() => getStatusUi(props.game.status))
const sportIcon = computed(() => getSportIcon(props.game.title))
const cardArt = computed(() => getGameCardArt(props.game.title))
const sportLabel = computed(() => getSportLabel(props.game.title))
const startTime = computed(() =>
  new Date(props.game.startsAt).toLocaleTimeString(bcp47Tag.value, { hour: '2-digit', minute: '2-digit' })
)
const startDateShort = computed(() =>
  new Date(props.game.startsAt).toLocaleDateString(bcp47Tag.value, { day: 'numeric', month: 'short' })
)
const durationLabel = computed(() => formatDuration(props.game.durationMinutes, bcp47Tag.value))
const priceLabel = computed(() => (props.game.price === 0 ? t('common.free') : t('common.priceValue', { price: props.game.price })))
const playersLabel = computed(() => `${props.game.seatsTaken}/${props.game.seatsTotal} ${t('common.playersWord', props.game.seatsTotal)}`)

const buttonVariant = computed(() => {
  if (isGameJoinable(props.game)) return 'join'
  if (props.game.status === GAME_STATUS.FULL || props.game.status === GAME_STATUS.CANCELLED) return 'disabled'
  return 'details'
})

const BUTTON_CLASSES: Record<string, string> = {
  join: 'w-full min-h-[44px] rounded-lg bg-gradient-to-r from-primary to-primary-container py-2 text-label-md text-white shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg',
  details: 'w-full min-h-[44px] rounded-lg border border-primary py-2 text-label-md text-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-container hover:text-white',
  disabled: 'w-full min-h-[44px] rounded-lg bg-surface-variant py-2 text-label-md text-on-surface-variant cursor-not-allowed'
}

const buttonLabel = computed(() => {
  if (buttonVariant.value === 'join') return t('map.joinGame')
  if (buttonVariant.value === 'details') return t('map.viewDetails')
  return statusUi.value.label
})
</script>

<template>
  <article
    class="bento-tile flex cursor-pointer flex-col overflow-hidden rounded-[1.75rem] bg-surface-container-lowest shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    role="button"
    tabindex="0"
    :aria-label="`${game.title}, ${statusUi.label}`"
    data-testid="game-card"
    :data-game-id="game.id"
    @click="emit('select', game.id)"
    @keydown.enter="emit('select', game.id)"
    @keydown.space.prevent="emit('select', game.id)"
  >
    <div class="relative h-36 w-full overflow-hidden">
      <PhotoPlaceholder
        :icon="cardArt.icon"
        :gradient-class="cardArt.gradientClass"
        :icon-color-class="cardArt.iconColorClass"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <div
        class="glass-panel-dark absolute right-sm top-sm flex items-center gap-xs rounded-full px-2 py-1 text-label-sm text-white"
      >
        <span
          class="h-2 w-2 rounded-full"
          :style="{ backgroundColor: statusUi.color }"
        />
        {{ statusUi.label }}
      </div>
      <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-xs p-md">
        <h3 class="text-headline-sm text-white">
          {{ game.title }}
        </h3>
        <span class="whitespace-nowrap text-label-md font-semibold text-white">{{ priceLabel }}</span>
      </div>
    </div>
    <div class="flex flex-col gap-xs p-md">
      <div class="flex items-center gap-xs text-body-sm text-on-surface-variant">
        <Icon
          :name="sportIcon"
          :size="16"
        />
        {{ sportLabel }}
        <span class="mx-1">·</span>
        <Icon
          name="schedule"
          :size="16"
        />
        <time :datetime="game.startsAt">{{ startTime }} · {{ startDateShort }}</time> · {{ durationLabel }}
      </div>
      <div class="mt-1 flex items-center gap-xs text-body-sm text-on-surface-variant">
        <Icon
          name="location_on"
          :size="16"
        />
        <address class="not-italic">
          {{ game.address }}
        </address>
      </div>
      <div class="mt-1 flex items-center gap-xs text-body-sm text-on-surface-variant">
        <Icon
          name="group"
          :size="16"
        />
        {{ playersLabel }}
      </div>
      <button
        type="button"
        :class="['mt-sm', BUTTON_CLASSES[buttonVariant]]"
        :disabled="buttonVariant === 'disabled'"
        data-testid="game-card-action"
        @click.stop="emit('select', game.id)"
      >
        {{ buttonLabel }}
      </button>
    </div>
  </article>
</template>
