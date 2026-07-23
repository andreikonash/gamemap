<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Avatar, EmptyState, Icon, PhotoPlaceholder, Skeleton } from '@/components/ui'
import { useAppLocale } from '@/i18n'
import { LOCALE_META } from '@/i18n/localeMeta'
import { getGameCardArt, getSportIcon, getSportLabel } from '@/utils/helpers/sportIcon'
import { REGISTRATION_STATUS, type IRegistration, type IRegistrationStatus } from '@/types/booking'

defineOptions({ name: 'CabinetGamesList' })

const { t } = useI18n()
const appLocale = useAppLocale()
const bcp47Tag = computed(() => LOCALE_META[appLocale.value].bcp47Tag)

const STATUS_UI = computed<Record<IRegistrationStatus, { accent: string, badgeBg: string, badgeText: string, badgeLabel: string }>>(() => ({
  [REGISTRATION_STATUS.PAID]: {
    accent: '#6cf8bb',
    badgeBg: '#6cf8bb',
    badgeText: '#00714d',
    badgeLabel: t('bookingStatus.confirmed')
  },
  [REGISTRATION_STATUS.PENDING_PAYMENT]: {
    accent: '#ffb95f',
    badgeBg: '#ffdad6',
    badgeText: '#93000a',
    badgeLabel: t('bookingStatus.paymentDue')
  }
}))

const props = defineProps<{
  registrations: IRegistration[]
  loading: boolean
  emptyMessage?: string
}>()
const emit = defineEmits<{ select: [gameId: string], cancel: [registrationId: string] }>()

const resolvedEmptyMessage = computed(() => props.emptyMessage ?? t('gamesList.emptyDefault'))

const sorted = computed(() =>
  [...props.registrations].sort(
    (a, b) => new Date(b.gameStartsAt).getTime() - new Date(a.gameStartsAt).getTime()
  )
)

function startLabel (registration: IRegistration) {
  return new Date(registration.gameStartsAt).toLocaleString(bcp47Tag.value, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function joinedPlayerCount (registration: IRegistration) {
  const charSum = [...registration.id].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return (charSum % 6) + 4
}

function overflowCount (registration: IRegistration) {
  return Math.max(joinedPlayerCount(registration) - 3, 0)
}
</script>

<template>
  <div
    v-if="loading"
    class="flex flex-col gap-md"
    data-testid="cabinet-loading"
  >
    <div
      v-for="n in 3"
      :key="n"
      class="space-y-2 rounded-xl border border-surface-container-low bg-surface p-md shadow-sm"
    >
      <Skeleton
        width="70%"
        height="20px"
      />
      <Skeleton
        width="40%"
        height="14px"
      />
      <Skeleton
        width="50%"
        height="24px"
      />
    </div>
  </div>
  <EmptyState
    v-else-if="registrations.length === 0"
    icon="sports_soccer"
    :title="t('gamesList.emptyStateTitle')"
    :description="resolvedEmptyMessage"
    data-testid="cabinet-empty"
  />
  <div
    v-else
    class="flex flex-col gap-md"
  >
    <article
      v-for="registration in sorted"
      :key="registration.id"
      class="bento-tile group relative flex flex-col gap-md overflow-hidden rounded-[1.75rem] border border-surface-container-low bg-surface p-md shadow-sm sm:flex-row md:p-lg"
      data-testid="cabinet-game"
    >
      <div
        class="absolute inset-block-start-0 inset-block-end-0 inset-inline-start-0 w-1"
        :style="{ backgroundColor: STATUS_UI[registration.status].accent }"
      />
      <div class="relative h-32 w-full shrink-0 overflow-hidden rounded-2xl sm:w-32">
        <PhotoPlaceholder
          :icon="getGameCardArt(registration.gameTitle).icon"
          :gradient-class="getGameCardArt(registration.gameTitle).gradientClass"
          :icon-color-class="getGameCardArt(registration.gameTitle).iconColorClass"
        />
        <div
          class="absolute right-2 top-2 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
          :style="{ backgroundColor: STATUS_UI[registration.status].badgeBg, color: STATUS_UI[registration.status].badgeText }"
          data-testid="cabinet-game-status"
        >
          {{ STATUS_UI[registration.status].badgeLabel }}
        </div>
      </div>
      <div class="flex flex-1 flex-col justify-between">
        <div>
          <div class="mb-1 flex items-start justify-between">
            <h3 class="text-headline-sm text-on-surface">
              {{ registration.gameTitle }}
            </h3>
            <span class="ml-2 whitespace-nowrap rounded-md bg-surface-container-high px-2 py-1 text-label-sm text-on-surface-variant">{{ t('common.priceValue', { price: registration.price }) }}</span>
          </div>
          <div class="mb-3 flex items-center gap-md text-body-sm text-on-surface-variant">
            <span class="flex items-center gap-1">
              <Icon
                :name="getSportIcon(registration.gameTitle)"
                :size="16"
              />
              {{ getSportLabel(registration.gameTitle) }}
            </span>
            <span class="flex items-center gap-1">
              <Icon
                name="schedule"
                :size="16"
              />
              <time :datetime="registration.gameStartsAt">{{ startLabel(registration) }}</time>
            </span>
          </div>
        </div>
        <div class="mt-auto flex flex-wrap items-center justify-between gap-md">
          <div class="flex items-center">
            <div class="mr-3 flex -space-x-2">
              <Avatar
                v-for="n in Math.min(joinedPlayerCount(registration), 3)"
                :key="n"
                :size="24"
                class="border border-surface"
              />
              <div
                v-if="overflowCount(registration) > 0"
                class="flex h-6 w-6 items-center justify-center rounded-full border border-surface bg-surface-container-high text-[10px] font-bold text-on-surface-variant"
              >
                +{{ overflowCount(registration) }}
              </div>
            </div>
            <span class="text-body-sm text-on-surface-variant">{{ t('gamesList.joiningCount', { count: joinedPlayerCount(registration) }) }}</span>
          </div>
          <div class="flex w-full gap-2 sm:w-auto">
            <button
              v-if="registration.status === REGISTRATION_STATUS.PENDING_PAYMENT"
              type="button"
              class="flex-1 rounded-lg border border-error/30 px-4 py-2 text-center text-label-sm text-error transition-colors hover:bg-error-container sm:flex-none"
              data-testid="cabinet-game-cancel"
              @click="emit('cancel', registration.id)"
            >
              {{ t('gamesList.cancel') }}
            </button>
            <button
              type="button"
              class="flex-1 rounded-lg bg-surface-container px-4 py-2 text-center text-label-sm text-on-surface transition-colors hover:bg-surface-container-highest sm:flex-none"
              @click="emit('select', registration.gameId)"
            >
              {{ t('gamesList.details') }}
            </button>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>
